/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { APIEntity, Changeset, ChangesetsResponse, CollectionResponse, iModel, iModelsResponse, NamedVersion, NamedVersionCreateRequest, NamedVersionResponse, NamedVersionsResponse } from "../Models";

import { appConfig } from "./AppConfigService";
import { authorizationService } from "./AuthorizationService";

enum PreferReturn {
  Minimal = "minimal",
  Representation = "representation"
}

// Service that wraps iModels API calls.
// IMPORTANT: please note that iModels API client packages exist. See the README.md file in repository root.
class IModelsService {
  // Returns minimal representation for all iModels of a project.
  // Documentation can be found at https://developer.bentley.com/api-groups/data-management/apis/imodels/operations/get-project-imodels/
  public async getiModels(projectId: string): Promise<iModel[]> {
    return this.getEntitiesInPages(
      appConfig.iModelsApiUrl,
      `?projectId=${projectId}`,
      PreferReturn.Minimal,
      (response: iModelsResponse) => response.iModels);
  }

  // Returns minimal representation for all Named Versions of an iModel.
  // Documentation can be found at https://developer.bentley.com/api-groups/data-management/apis/imodels/operations/get-imodel-named-versions/
  public async getNamedVersions(iModelId: string): Promise<NamedVersion[]> {
    return this.getEntitiesInPages(
      `${appConfig.iModelsApiUrl}/${iModelId}/namedversions`,
      undefined,
      PreferReturn.Minimal,
      (response: NamedVersionsResponse) => response.namedVersions);
  }

  // Returns full representation for all Changesets of an iModel.
  // Documentation can be found at https://developer.bentley.com/api-groups/data-management/apis/imodels/operations/get-imodel-changesets/
  public async getChangesets(iModelId: string): Promise<Changeset[]> {
    const changesets = await this.getEntitiesInPages(
      `${appConfig.iModelsApiUrl}/${iModelId}/changesets`,
      undefined,
      PreferReturn.Representation,
      (response: ChangesetsResponse) => response.changesets);

    // Full representation for Changesets includes links to related entities. Here we use the `namedVersion` link
    // which points to a Named Version that is created for a particular Changeset.
    await Promise.all(changesets.map(async (changeset) => {
      if (changeset._links.namedVersion) {
        const namedVersionResponse: NamedVersionResponse | undefined = await this.sendGetRequest(changeset._links.namedVersion.href);
        changeset.namedVersion = namedVersionResponse?.namedVersion;
      }
    }));

    return changesets;
  }

  // Creates a new Named Version for a specified iModel with specified properties.
  // Documentation can be found at https://developer.bentley.com/api-groups/data-management/apis/imodels/operations/create-imodel-named-version/
  public async createNamedVersion(iModelId: string, changesetId: string | undefined, namedVersionName: string, namedVersionDescription: string | undefined): Promise<void> {
    const namedVersionToCreate: NamedVersionCreateRequest =
    {
      name: namedVersionName,
      description: namedVersionDescription,
      changesetId,
    };

    const namedVersionCreateRequestBody = JSON.stringify(namedVersionToCreate);
    await this.sendPostRequest(`${appConfig.iModelsApiUrl}/${iModelId}/namedversions`, namedVersionCreateRequestBody);
  }

  // All iModels API collection requests support paging with $skip and $top URL parameters.
  // The default page size is 100, maximum page size - 1000.
  // Users can implement paging by manually keeping track of the queried instance count and passing that as a $skip
  // parameter value or they can use links that are returned as a '_links' property value with every collection response.
  // This method uses 'next' link to query the next page.
  // Paging documentation can be found under any collection operation documentation,
  // e.g. https://developer.bentley.com/api-groups/data-management/apis/imodels/operations/get-imodel-changesets/
  private async getEntitiesInPages<TResponse extends CollectionResponse, TEntity extends APIEntity>(
    url: string,
    urlParams: string | undefined,
    preferReturn: PreferReturn | undefined,
    responsePropertyAccessor: (response: TResponse) => TEntity[],
    pageSize: number = 100): Promise<TEntity[]> {

    const firstPageSkipTopUrlParams = `$skip=0&$top=${pageSize}`;
    const firstPageUrlParams =
      urlParams
        ? `${urlParams}&${firstPageSkipTopUrlParams}`
        : `?${firstPageSkipTopUrlParams}`;

    let result: TEntity[] = [];
    let pageLink: string | undefined = `${url}${firstPageUrlParams}`;

    do {
      const response: TResponse = await this.sendGetRequest(pageLink, preferReturn);
      if (!response)
        return [];

      result = result.concat(responsePropertyAccessor(response));
      pageLink = response._links.next?.href;

    // iModels API will always return a next page link if there are remaining entities.
    // If the next page link is not returned it means that all entities have been queried.
    } while (pageLink);

    return result;
  }

  private async sendGetRequest<TResponse>(url: string, preferReturn: PreferReturn | undefined = undefined): Promise<TResponse> {
    const headers: HeadersInit = { Authorization: await authorizationService.getAccessToken() };
    // API entity collection requests support Prefer header which allows user to specify the response
    // type - whether it should only contain minimal metadata about entities or full information.
    // Documentation on Prefer headers can be found under any collection operation documentation,
    // e.g. https://developer.bentley.com/api-groups/data-management/apis/imodels/operations/get-imodel-changesets/
    if (preferReturn)
      headers.Prefer = `return=${preferReturn}`;

    const response: Response = await fetch(url, { method: "GET", headers });
    if (!response.ok)
      return this.handleFaultyResponse(response);

    const deserializedResponse: TResponse = await response.json() as TResponse;
    return deserializedResponse;
  }

  private async sendPostRequest<TResponse>(url: string, body: string): Promise<TResponse> {
    const headers: HeadersInit = { Authorization: await authorizationService.getAccessToken() };
    const response: Response = await fetch(url, { method: "POST", body, headers });
    if (!response.ok)
      return this.handleFaultyResponse(response);

    const deserializedResponse: TResponse = await response.json() as TResponse;
    return deserializedResponse;
  }

  private async handleFaultyResponse<TResponse>(response: Response): Promise<TResponse> {
    // Here we just reject the promise for the sake of simplicity but clients are recommended
    // to have more robust error handling, possibly with retries.
    // Possible errors are documented under 'Responses' section for each operation.
    return Promise.reject(new Error(response.status.toString()));
  }
}

export const iModelsService = new IModelsService();

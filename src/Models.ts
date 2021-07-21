/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

// The models defined below that are used in communication with the API do not fully represent
// returned responses. Types here define only those properties that are used somewhere in the
// application for display or other purposes. See the API documentation for full response
// definitions: https://developer.bentley.com/api-groups/data-management/apis/imodels

export type APIEntity = {
  id: string;
  displayName: string;
};

export type iModel = APIEntity;

export type NamedVersion = APIEntity;

export type Changeset = {
  index: number;
  _links: ChangesetLinks;
  namedVersion: NamedVersion | undefined;
} & APIEntity;

export type Link = {
  href: string;
};

export type ChangesetLinks = {
  creator: Link;
  namedVersion: Link | undefined;
};

export type CollectionResponseLinks = {
  self: Link;
  prev: Link | undefined;
  next: Link | undefined;
};

export type CollectionResponse = {
  _links: CollectionResponseLinks;
};

export type iModelsResponse = {
  iModels: iModel[];
} & CollectionResponse;

export type ChangesetsResponse = {
  changesets: Changeset[];
} & CollectionResponse;

export type NamedVersionsResponse = {
  namedVersions: NamedVersion[];
} & CollectionResponse;

export type NamedVersionResponse = {
  namedVersion: NamedVersion;
};

export type NamedVersionCreateRequest = {
  name: string;
  description: string | undefined;
  changesetId: string | undefined;
};

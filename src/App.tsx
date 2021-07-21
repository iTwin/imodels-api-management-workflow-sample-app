/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React, { useCallback, useEffect, useState } from "react";
import { iModelsService } from "./services/iModelsService";
import { APIEntity, Changeset } from "./Models";
import { Button, Headline, Table, Title, toaster } from "@itwin/itwinui-react";
import { CellProps } from "react-table";
import ChangesetDetails from "./ChangesetDetails";
import NamedVersionDetails from "./NamedVersionDetails";
import "./App.scss";

const App = () => {
  const [areiModelsLoading, setAreiModelsLoading] = useState<boolean>(true);
  const [iModels, setiModels] = useState<APIEntity[]>([]);
  const [selectediModel, setSelectediModel] = useState<APIEntity | undefined>(undefined);

  const [areNamedVersionsLoading, setAreNamedVersionsLoading] = useState<boolean>(false);
  const [namedVersions, setNamedVersions] = useState<APIEntity[]>([]);

  const [areChangesetsLoading, setAreChangesetsLoading] = useState<boolean>(false);
  const [changesets, setChangesets] = useState<Changeset[]>([]);

  useEffect(() => {
    if (!process.env.IMJS_PROJECT_ID)
      throw new Error("Missing configuration. Key IMJS_PROJECT_ID must have a value. Please edit the .env file.");

    iModelsService.getiModels(process.env.IMJS_PROJECT_ID)
      .then((queriediModels) => setiModels(queriediModels))
      .catch((e) => toaster.negative(`iModels query failed with status code ${e.message}.`))
      .finally(() => setAreiModelsLoading(false));
  }, []);

  const loadDetails = useCallback((iModelId: string) => {
    getNamedVersions(iModelId);
    getChangesets(iModelId);
  }, []);

  useEffect(() => {
    if (selectediModel)
      loadDetails(selectediModel.id);
  }, [selectediModel, loadDetails]);

  const getNamedVersions = (iModelId: string) => {
    setAreNamedVersionsLoading(true);
    iModelsService.getNamedVersions(iModelId)
      .then((queriedNamedVersions) => setNamedVersions(queriedNamedVersions))
      .catch((e) => toaster.negative(`Named Versions query failed with status code ${e.message}.`))
      .finally(() => setAreNamedVersionsLoading(false));
  };

  const getChangesets = (iModelId: string) => {
    setAreChangesetsLoading(true);
    iModelsService.getChangesets(iModelId)
      .then((queriedChangesets) => setChangesets(queriedChangesets))
      .catch((e) => toaster.negative(`Changesets query failed with status code ${e.message}.`))
      .finally(() => setAreChangesetsLoading(false));
  };

  const onNamedVersionCreated = () => {
    if (selectediModel)
      loadDetails(selectediModel.id);
  };

  const columns = [
    {
      Header: "Id",
      columns: [
        {
          id: "Id",
          Header: "Id",
          accessor: "id",
          width: 300,
        },
        {
          id: "DisplayName",
          Header: "Display name",
          accessor: "displayName",
        },
        {
          id: "View",
          Cell: (props: CellProps<APIEntity>) => {
            return <Button size="small" onClick={() => setSelectediModel(props.row.original)}>
              View details
            </Button>;
          },
        },
      ],
    },
  ];

  const iModelDetails =
    !selectediModel
      ? <div className="imodel-details-placeholder">Please select an iModel</div>
      : <div className="imodel-details-container">
        <div className="imodel-details-component">
          <Title>iModel &quot;<span className="title-resource-identifier">{selectediModel.displayName}</span>&quot; Changesets</Title>
          <ChangesetDetails
            changesets={changesets}
            isLoading={areChangesetsLoading}
            iModelId={selectediModel.id}
            onNamedVersionCreated={onNamedVersionCreated} />
        </div>
        <div className="imodel-details-component">
          <Title>iModel &quot;<span className="title-resource-identifier">{selectediModel.displayName}</span>&quot; Named Versions</Title>
          <NamedVersionDetails
            namedVersions={namedVersions}
            isLoading={areNamedVersionsLoading} />
        </div>
      </div>;

  return <div>
    <Headline className="page-title">iModels for project <span className="title-resource-identifier">{process.env.IMJS_PROJECT_ID}</span></Headline>
    <Table
      className="imodels-table"
      columns={columns}
      data={iModels}
      isLoading={areiModelsLoading}
      emptyTableContent="No iModels."
    />
    {iModels.length > 0 && iModelDetails}
  </div>;
};

export default App;

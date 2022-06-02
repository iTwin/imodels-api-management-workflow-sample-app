/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";
import { Changeset } from "./Models";
import { Table } from "@itwin/itwinui-react";
import { CellProps } from "react-table";
import CreateNamedVersionModal from "./CreateNamedVersionModal";
import { IModelsService } from "./services/IModelsService";

type ChangesetDetailsProps = {
  iModelsService: IModelsService;
  changesets: Changeset[];
  isLoading: boolean;
  iModelId: string;
  onNamedVersionCreated: () => void;
};

const ChangesetDetails: React.FC<ChangesetDetailsProps> = ({
  iModelsService,
  changesets,
  isLoading,
  iModelId,
  onNamedVersionCreated
}: ChangesetDetailsProps
) => {
  const columns = [
    {
      Header: "Id",
      columns: [
        {
          id: "Id",
          Header: "Id",
          accessor: "id",
          width: 350,
        },
        {
          id: "Index",
          Header: "Index",
          accessor: "index",
          width: 120,
        },
        {
          id: "NamedVersionName",
          Header: "Named version name",
          Cell: (props: CellProps<Changeset>) => {
            return props.row.original.namedVersion
              ? <span>{props.row.original.namedVersion.displayName}</span>
              : <CreateNamedVersionModal
                iModelsService={iModelsService}
                iModelId={iModelId}
                changesetIndex={props.row.original.index}
                changesetId={props.row.original.id}
                onNamedVersionCreated={onNamedVersionCreated}
              ></CreateNamedVersionModal>;
          },
        },
      ],
    },
  ];

  return <Table<Changeset>
    columns={columns}
    data={changesets}
    isLoading={isLoading}
    emptyTableContent="No Changesets."
  />;
};

export default ChangesetDetails;

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Table } from "@itwin/itwinui-react";
import React from "react";

import { APIEntity } from "./Models";

type NamedVersionDetailsProps = {
  namedVersions: APIEntity[];
  isLoading: boolean;
};

const NamedVersionDetails: React.FC<NamedVersionDetailsProps> = ({
  namedVersions,
  isLoading
}: NamedVersionDetailsProps) => {
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
      ],
    },
  ];

  return <Table<APIEntity>
    columns={columns}
    data={namedVersions}
    isLoading={isLoading}
    emptyTableContent="No Named Versions."
  />;
};

export default NamedVersionDetails;

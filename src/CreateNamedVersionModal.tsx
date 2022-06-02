/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React, { useState } from "react";
import { Button, LabeledInput, Modal, ModalButtonBar, toaster } from "@itwin/itwinui-react";
import { iModelsService } from "./services/IModelsService";
import "./CreateNamedVersionModal.scss";

type CreateNamedVersionModalProps = {
  iModelId: string;
  changesetIndex: number;
  changesetId: string;
  onNamedVersionCreated: () => void;
};

const CreateNamedVersionModal: React.FC<CreateNamedVersionModalProps> = ({
  iModelId,
  changesetIndex,
  changesetId,
  onNamedVersionCreated
}: CreateNamedVersionModalProps) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [versionName, setVersionName] = useState<string>(`Milestone ${changesetIndex}`);
  const [versionDescription, setVersionDescription] = useState<string | undefined>(undefined);
  const [creatingVersion, setCreatingVersion] = useState<boolean>(false);

  const createVersion = () => {
    setCreatingVersion(true);
    iModelsService.createNamedVersion(iModelId, changesetId, versionName, versionDescription)
      .then(() => onNamedVersionCreated())
      .catch((e) => toaster.negative(`Named Version create request failed with status code ${e.message}.`))
      .finally(() => {
        setCreatingVersion(false);
        setIsModalVisible(false);
      });
  };

  return <span>
    <Button size="small" onClick={() => setIsModalVisible(true)}>Create Named Version</Button>
    <Modal
      isOpen={isModalVisible}
      title="Create a Named Version"
      onClose={() => setIsModalVisible(false)}>

      <LabeledInput className="named-version-input-field" label="Named Version name" value={versionName} onChange={(e) => setVersionName(e.target.value)} />
      <LabeledInput className="named-version-input-field" label="Named Version description" value={versionDescription || ""} onChange={(e) => setVersionDescription(e.target.value)} />
      <ModalButtonBar>
        <Button styleType="high-visibility" disabled={creatingVersion} onClick={createVersion}>
          Create
        </Button>
      </ModalButtonBar>
    </Modal>
  </span>;
};

export default CreateNamedVersionModal;


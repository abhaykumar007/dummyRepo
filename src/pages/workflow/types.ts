export type workflowStage = {
  id?: number;
  name: string;
  sequence: number;
  stepId?: string;
  description?: string;
  parentId?: string | null;
  duration?: number;
  zoneId?: string;
  nurseryId?: string;
};

export type workflowPayload = {
  name?: string;
  description?: string;
  workflowSteps: workflowStage[];
};

export type workflow = {
  id: string;
  workflowId: string;
  description: string;
  partnerId: string;
  name: string;
  organisationId: string;
  isInbuilt: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdDate: string;
  updatedDate: string;
  workflowSteps: [workflowStage];
};

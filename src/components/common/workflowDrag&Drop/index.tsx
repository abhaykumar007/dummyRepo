import { workflowStage } from "@/pages/workflow/types";
import { getTranslation } from "@/translation/i18n";
import {
  DragDropContext,
  Draggable,
  DragUpdate,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Empty } from "antd";
import React from "react";
import "./style.scss";

interface WorkflowDragAndDropProps {
  onDragEnd: (result: DropResult) => void;
  onDragUpdate: (upate: DragUpdate) => void;
  setDraggedItem: (value: string | null) => void;
  stageList: workflowStage[];
  placeholderIndex: number | null;
  selectedStage?: string;
  draggedItem: string | null;
  isCorrect: boolean;
  isLifeCycle?: boolean;
  finalList: workflowStage[];
  handleSelectFinalStep?: (stage: workflowStage) => void;
}

const WorkflowDragAndDrop = ({
  onDragEnd,
  onDragUpdate,
  setDraggedItem,
  stageList,
  placeholderIndex,
  draggedItem,
  isCorrect,
  finalList,
  selectedStage,
  handleSelectFinalStep,
  isLifeCycle,
}: WorkflowDragAndDropProps) => {
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragUpdate={onDragUpdate}
      onDragStart={(start) => setDraggedItem(start.draggableId)}
    >
      <div
        className="workflow_container"
        style={{ marginTop: isLifeCycle ? 0 : "15px" }}
      >
        <Droppable droppableId="stageList">
          {(provided, snapshot) => (
            <div
              className="card_list_container"
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ width: isLifeCycle ? "320px" : "380px" }}
            >
              <p className="heading2 card_title">
                {isLifeCycle
                  ? getTranslation("workflow.selectLifeCycleStage")
                  : getTranslation("workflow.selectStage")}
              </p>
              <div className="card_container">
                {stageList.length > 0 ? (
                  stageList.map((stage, index) => (
                    <React.Fragment key={stage.id}>
                      {index === placeholderIndex &&
                        snapshot.draggingOverWith === draggedItem && (
                          <div
                            className={`dropzone ${
                              isCorrect ? "correct" : "wrong"
                            }`}
                          >
                            {isCorrect
                              ? getTranslation("workflow.correctPosition")
                              : getTranslation("workflow.wrongPosition")}
                          </div>
                        )}

                      <Draggable draggableId={`${stage.id}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            className={`card single_stage_card heading2 ${
                              snapshot.isDragging ? "dragging" : ""
                            }`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {stage.name}
                          </div>
                        )}
                      </Draggable>
                    </React.Fragment>
                  ))
                ) : (
                  <div className="empty_container">
                    <Empty />
                  </div>
                )}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>

        <Droppable droppableId="finalList">
          {(provided, snapshot) => (
            <div
              className="card_list_container"
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ width: isLifeCycle ? "320px" : "380px" }}
            >
              <p className="heading2 card_title">
                {isLifeCycle
                  ? getTranslation("workflow.finalLifeCycleStage")
                  : getTranslation("workflow.finalStage")}
              </p>
              <div className="card_container">
                {finalList.length > 0 ? (
                  finalList.map((stage, index) => (
                    <React.Fragment key={stage.id}>
                      {index === placeholderIndex &&
                        snapshot.draggingOverWith === draggedItem && (
                          <div
                            className={`dropzone ${
                              isCorrect ? "correct" : "wrong"
                            }`}
                          >
                            {isCorrect
                              ? getTranslation("workflow.correctPosition")
                              : getTranslation("workflow.wrongPosition")}
                          </div>
                        )}

                      <Draggable draggableId={`${stage.id}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            className={`card final_stage_card ${
                              snapshot.isDragging ? "dragging" : ""
                            } ${
                              selectedStage && selectedStage === stage.name
                                ? "final_stage_card_selected"
                                : ""
                            }`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={
                              handleSelectFinalStep
                                ? () => handleSelectFinalStep(stage)
                                : () => {}
                            }
                          >
                            <div className="final_stage_inside_card">
                              <div className="stage_count_container">
                                {index + 1}
                              </div>
                              <p className="heading2">{stage.name}</p>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    </React.Fragment>
                  ))
                ) : (
                  <div className="empty_container">
                    <Empty />
                  </div>
                )}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default WorkflowDragAndDrop;

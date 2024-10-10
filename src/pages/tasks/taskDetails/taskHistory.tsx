import { getAlphabetColor } from "@/pages/userManagement/utils";
import { getDateTimeInStandardFormat } from "@/utilities/time";
import { Avatar, Flex, Typography } from "antd";
import { useEffect, useRef } from "react";

const TaskHistory = ({ comment }: any) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const element = ref.current;
      if (element) {
        element.innerHTML = comment.comment;
      }
    }, []);
    return (
      <Flex
        gap={10}
        style={{ marginTop: "5px", maxHeight:'400px', overflowY: "auto" }}
        key={comment.tasksHistoryId}
        vertical
      >
        <Flex gap={10} style={{ marginTop: "5px" }} align="center">
          <Avatar
            size={40}
            style={{
              backgroundColor: getAlphabetColor(comment.createdByName[0]),
            }}
          >
            {comment.createdByName[0]}
          </Avatar>
          <Typography.Text style={{ fontWeight: "600" }}>
            {comment.createdByName}
          </Typography.Text>
          <Typography.Text style={{ color: "grey" }}>
            commented on {getDateTimeInStandardFormat(comment.createdDate)}
          </Typography.Text>
        </Flex>
        <div style={{ paddingLeft: "50px" }} ref={ref} />
      </Flex>
    );
  };

export default TaskHistory;
import React from "react";

const WorkerTasksAssigned = () => {
  return (
    <div style={styles.container}>
      <h1>Tasks Assigned</h1>
      <p>Here you will find all the tasks assigned to you.</p>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px"
  }
};

export default WorkerTasksAssigned;

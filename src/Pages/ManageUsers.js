import React from "react";

const ManageUsers = () => {
  return (
    <div style={styles.container}>
      <h1>Manage Users</h1>
      <p>Here you can add, update, or delete users.</p>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px"
  }
};

export default ManageUsers;

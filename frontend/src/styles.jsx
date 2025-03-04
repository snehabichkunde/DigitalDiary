const styles = {
  container: {
      display: "flex",
      flexDirection: "row",
      minHeight: "100vh",
      overflow: "hidden",
  },
  sidebar: {
      width: "250px",
      flexShrink: 0,
      '@media (maxWidth: 768px)': {
          width: "100%",
          position: 'fixed',
          bottom: 0,
          zIndex: 100,
          //backgroundColor: '#f4f4f4'
      }
  },
  content: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      //backgroundColor: "#fdf4dc",
      padding: "0px",
      fontFamily: "Georgia, 'Times New Roman', serif",
      color: "#001a33",
      overflowY: "auto",
      backgroundSize: "cover",
      backgroundPosition: "center",
      '@media (maxWidth: 768px)': {
          //paddingBottom: '60px', // Add padding equal to the NavBar height
      },
  },
  header: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      flex: 1,
      width: "100%",
      paddingTop: "30px",
      paddingBottom: "20px",
  },
  h2: {
      fontSize: "2rem",
      fontFamily: "Georgia, 'Times New Roman', serif",
      color: "#001a33",
      marginBottom: "20px",
  },
  inputWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "90%",
      maxWidth: "1000px",
      marginBottom: "20px",
      flexWrap: 'wrap',
      '@media (maxWidth: 768px)': {
          flexDirection: 'column',
          alignItems: 'stretch',
      },
  },
  input: {
      flex: 1,
      padding: "8px",
      fontSize: "1rem",
      fontFamily: "Georgia, 'Times New Roman', serif",
      backgroundColor: "transparent",
      border: "1px solid #001a33",
      color: "#001a33",
      outline: "none",
      marginRight: "10px",
      marginBottom: '10px',
      '@media (maxWidth: 768px)': {
          marginRight: '0',
      },
  },
  select: {
      padding: "8px",
      fontSize: "1rem",
      fontFamily: "Georgia, 'Times New Roman', serif",
      border: "1px solid #001a33",
      color: "#001a33",
      backgroundColor: "transparent",
      cursor: "pointer",
      marginRight: "10px",
      marginBottom: '10px',
      '@media (maxWidth: 768px)': {
          marginRight: '0',
      },
  },
  dateButton: {
      padding: "8px 16px",
      fontSize: "1rem",
      fontFamily: "Georgia, 'Times New Roman', serif",
      border: "1px solid #001a33",
      color: "#001a33",
      backgroundColor: "transparent",
      cursor: "pointer",
      textAlign: "left",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      whiteSpace: "nowrap",
      marginBottom: '10px',
      '@media (maxWidth: 768px)': {
         width: '100%'
      },
  },
  datePickerContainer: {
      backgroundColor: "#fff",
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      zIndex: 10,
      marginTop: "4px",
  },
  dateInput: {
      padding: "8px",
      border: "none",
      borderRadius: "4px",
      fontSize: "1rem",
      fontFamily: "Georgia, 'Times New Roman', serif",
      boxShadow: "none",
      backgroundColor: "#f0f0f0",
      marginBottom: '10px',
      '@media (maxWidth: 768px)': {
         width: '100%'
      },
  },

  applyButton: {
      padding: "8px 12px",
      fontSize: "1rem",
      fontFamily: "Georgia, 'Times New Roman', serif",
      border: "1px solid #001a33",
      color: "#001a33",
      backgroundColor: "transparent",
      cursor: "pointer",
  },
  listWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
      width: "90%",
      maxWidth: "1000px",
  },
  listItem: {
      padding: "5px",
      margin: "3px 0",
      fontSize: "1.2rem",
      color: "#001a33",
      cursor: "pointer",
      transition: "transform 0.2s ease",
      textDecoration: "underline",
  },
  resetDate: {
      marginLeft: "10px",
      color: "#001a33",
      cursor: "pointer",
      fontWeight: "bold",
  }
};

export default styles;
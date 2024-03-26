const [profilePic, setProfilePic] = useState(null);

const saveNotes = async () => {
    try {
      const data = { id, clientNotes, profilePic };
      const response = await axios.post(process.env.REACT_APP_ADDNOTES, data);
      console.log("Successfully added notes :", response.data);
    } catch (error) {
      console.log("Error saving notes :", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
  };
  
//   inside return
  <Form>
  <Form.Group controlId="formFileSm" className="mb-3">
    <Form.Label>Small file input example</Form.Label>
    <Form.Control
      type="file"
      size="sm"
      onChange={handleFileChange}
    />
  </Form.Group>
</Form>

<Button size="sm" variant="primary" onClick={saveNotes}>
Save Changes
</Button>


{documents?.length > 0 ? (
  <div>
    {documents.map((document) => (
      // Render component for each document
      <div>
        <p>{document}</p>
        {/* Other document information */}
      </div>
    ))}
  </div>
) : (
  <div>
    <p>No documents</p>
  </div>
)}
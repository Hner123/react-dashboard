import React, { useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const FileUploadButton = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState("");
  const [fileName, setFileName] = useState("");

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    onFileSelect(file);
    setFileName(file.name);
    const base64String = await convertFileToBase64(file);
    setProfilePic(base64String);
  };

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="image/*"
      />
      <IconButton className="Edit-profile-pic" onClick={handleButtonClick}>
        <PhotoCameraIcon />
      </IconButton>
    </>
  );
};

export default FileUploadButton;

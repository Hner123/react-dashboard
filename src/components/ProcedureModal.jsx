import { useState } from "react";
import Button from "react-bootstrap/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Spinner from "react-bootstrap/Spinner";

export default function ProcedureModal() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Button variant="primary" disabled={isLoading} onClick={() => setIsLoading(true)}>
        <Spinner style={{ display: isLoading ? "inline-block" : "none" }} animation="border" size="sm" />{" "}
        &nbsp;
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </>
  );
}

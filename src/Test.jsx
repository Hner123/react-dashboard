import { Output } from "@mui/icons-material";

{
  confirmNames?.length > 0 && (
    <>
      {confirmNames.map((confirmName, index) => (
        <tr key={index}>
          {" "}
          {/* Ensure each mapped element has a unique key */}
          <td>{confirmName}</td>
          <td>{confirmSched[index]}</td> {/* Access confirmSched by index */}
        </tr>
      ))}
    </>
  );
}

[
  "HEINER ABORKA",
  "HEINER ABORKA",
  "HEINER ABORKA",
  "location 1 loc 1",
  "Mang Jose",
  "loc 1 location 1",
  "Antipolo loc2",
  "Mang Kanor",
];

const dataSet = [
  ["HEINER ABORKA"],
  ["HEINER ABORKA"],
  ["HEINER ABORKA"],
  ["location 1 loc 1"],
];



{
  "title": "HEINER ABORKA",
  "start": "2024-1-30 16:30:00"
},
{
  "title": "HEINER ABORKA",
  "start": "2024-1-31 11:30:00"
}


in php if I use this code 
$calendar = array(
  'title' => $row['First_Name'] . " " . $row['Last_Name'],
  'start' => $confirmDate . " " . $confirmTime
);
$calendarData[] = $calendar;

I would have this kind of Output
{
  "title": "HEINER ABORKA",
  "start": "2024-1-30 16:30:00"
},
{
  "title": "HEINER ABORKA",
  "start": "2024-1-31 11:30:00"
}

how do I remove that qoute of "title" and "start" to make it title only no appostrope
I want the output to look like this
{
  title: "HEINER ABORKA",
  start: "2024-1-30 16:30:00"
},
{
  title: "HEINER ABORKA",
  start: "2024-1-31 11:30:00"
}



const fetchBookingData = async () => {
  try {
    const response = await axios.post(process.env.REACT_APP_BOOKINGLIST);
    console.log("Post successful:", response.data);

  } catch (error) {
    console.error("Error posting data:", error);
  }
};
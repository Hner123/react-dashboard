import Header from '../components/Header';
import SidePanel from '../components/SidePanel';
import { useState, useEffect } from 'react';
import '../style/history.css';
import axios from 'axios';
import DataTable from 'datatables.net-bs5';

export default function History() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);
  const [preload, setPreload] = useState(true);
  const [active, setActive] = useState('History');

  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
    console.log('dashboard ' + sidePanelOPen);
  };

  const fetchHistoryData = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_HISTORYLIST);
      console.log('Post successful:', response.data);

      const table = new DataTable('#myTable', {
        data: response.data.history_data,
        columns: [
          { title: 'ID' },
          { title: 'History Data' },
          { title: 'Deleted From' },
          { title: 'Date Deleted' },
        ],
        destroy: true, // I think some clean up is happening here
        responsive: true,
        deferRender: true,
        columnDefs: [
          {
            target: 0,
            visible: false,
            searchable: false,
          },
          { responsivePriority: 1, targets: 1 },
          { responsivePriority: 2, targets: -1 },
        ],
      });
      // Extra step to do extra clean-up.
      return function () {
        console.log('Table destroyed');
        table.destroy();
        // console.log("events to" + events);
      };
    } catch (error) {
      console.error('Error posting data:', error);
    } finally {
      setPreload(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} preload={preload} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} activeNav={active} />

      <div className="historyPage">
        <h1>History</h1>
        <div className="historyTable">
          <table id="myTable" className="row-border" width="100%"></table>
        </div>
      </div>
    </>
  );
}

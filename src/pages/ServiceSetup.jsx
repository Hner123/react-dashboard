import Header from '../components/Header';
import SidePanel from '../components/SidePanel';
import { useState } from 'react';

export default function ServiceSetup() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);
  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
  };
  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} />
    </>
  );
}

import { useEffect, useState } from 'react';
import MyContext from './MyContext';
import { useQuery } from '@tanstack/react-query';
import { fetchBranchList } from './reactQueryApi/api.js';

const MyProvider = ({ children }) => {
  const [branchLoc, setBranchLoc] = useState('');
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [editServiceData, setEditServiceData] = useState({});
  const [dropDown, setDropDown] = useState(false);
  const [activePanel, setActivePanel] = useState('Dashboard');

  const {
    data: branchList,
    error: branchError,
    isLoading: branchLoading,
  } = useQuery({
    queryKey: ['fetchBranch'],
    queryFn: fetchBranchList,
  });

  if (branchLoading) {
    return <div>Loading...</div>;
  }

  if (branchError) {
    return <div>Error: {branchError.message}</div>;
  }

  return (
    <MyContext.Provider
      value={{
        activePanel,
        setActivePanel,
        dropDown,
        setDropDown,
        branchList,
        branchLoc,
        setBranchLoc,
        id,
        setId,
        name,
        setName,
        lastName,
        setLastName,
        editServiceData,
        setEditServiceData,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;

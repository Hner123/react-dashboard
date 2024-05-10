import Header from '../components/Header';
import SidePanel from '../components/SidePanel';
import '../style/booking.css';
import axios from 'axios';

import { useEffect, useState, useRef } from 'react';
import DataTable from 'datatables.net';
import $ from 'jquery';
import 'datatables.net-responsive';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

export default function Test() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);
  const [show, setShow] = useState(false);
  const [firstRowData, setFirstRowData] = useState(0);
  const [showCancel, setShowCancel] = useState(false);
  const [reasons, setReasons] = useState('');

  const test = () => {
    console.log('Test');
  };

  return <></>;
}

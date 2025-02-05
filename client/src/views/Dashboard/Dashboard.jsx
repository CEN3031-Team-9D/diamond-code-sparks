import React, { useEffect, useState } from 'react';
import { getMentor, getClassrooms } from '../../../Utils/requests';
import { message, Tabs, Input, Select, Button } from 'antd';
import './Dashboard.less';
import DashboardDisplayCodeModal from './DashboardDisplayCodeModal';
import MentorSubHeader from '../../../components/MentorSubHeader/MentorSubHeader';
import NavBar from '../../../components/NavBar/NavBar';
import { useGlobalState } from '../../../Utils/userState';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { TabPane } = Tabs;
const { Option } = Select;

export default function Dashboard() {
  const [classrooms, setClassrooms] = useState([]);
  const [value] = useGlobalState('currUser');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [filter, setFilter] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [learningStandardList, setLessonModuleList] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [activeClassrooms, setActiveClassrooms] = useState([]);
  const [inactiveClassrooms, setInactiveClassrooms] = useState([]);

  useEffect(() => {
    let classroomIds = [];
    getMentor().then((res) => {
      if (res.data) {
        res.data.classrooms.forEach((classroom) => {
          classroomIds.push(classroom.id);
        });
        getClassrooms(classroomIds).then((classroomsResponse) => {
          if (classroomsResponse) {
            // Add isActive property to each classroom object
            const classroomsWithStatus = classroomsResponse.map(classroom => ({
              ...classroom,
              isActive: true // Assuming all classrooms are initially active
            }));
  
            // Separate active and inactive classrooms
            const activeCls = classroomsWithStatus.filter(c => c.isActive);
            const inactiveCls = classroomsWithStatus.filter(c => !c.isActive);
  
            // Update state
            setClassrooms(classroomsWithStatus);
            setActiveClassrooms(activeCls);
            setInactiveClassrooms(inactiveCls);
          } else {
            message.error('Failed to retrieve classrooms');
          }
        });
      } else {
        message.error(res.err);
        navigate('/teacherlogin');
      }
    });
  }, [navigate]); // Added navigate to the dependency array as it is being used inside the effect
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  const filteredClassrooms = classrooms.filter((classroom) =>
    classroom.name.toLowerCase().includes(filter)
  );

  const handleViewClassroom = (classroomId) => {
    navigate(`/classroom/${classroomId}`);
  };

  const onTabChange = (key) => {
    setActiveTab(key);
  };

  const handleSortChange = (value) => {
    const [criteria, order] = value.split('_');
    setSortCriteria(criteria);
    setSortOrder(order);
  };

  // This should be updated with the correct utility function that fetches the current classroom manager
  const getClassroomManager = async () => {
    try {
      const response = await axios.get('/api/classroom-managers/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching classroom manager:', error);
      throw error;
    }
  };

  const toggleClassroomActiveState = (classroomId) => {
    setClassrooms(prevClassrooms => {
      // Map over the previous classrooms and toggle the isActive state for the matching classroom
      const updatedClassrooms = prevClassrooms.map(c =>
        c.id === classroomId ? { ...c, isActive: !c.isActive } : c
      );
  
      // After updating the main classrooms list, we can derive the active and inactive lists
      const updatedActiveClassrooms = updatedClassrooms.filter(c => c.isActive);
      const updatedInactiveClassrooms = updatedClassrooms.filter(c => !c.isActive);
  
      // Update the activeClassrooms and inactiveClassrooms state based on the updated classrooms
      setActiveClassrooms(updatedActiveClassrooms);
      setInactiveClassrooms(updatedInactiveClassrooms);
  
      // Return the updated classrooms array to update the state
      return updatedClassrooms;
    });
  };
  
  const sortedClassrooms = filteredClassrooms.sort((a, b) => {
    if (sortCriteria === 'name') {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortCriteria === 'students') {
      // Assuming classroom.students is an array
      return sortOrder === 'asc'
        ? a.students.length - b.students.length
        : b.students.length - a.students.length;
    } else if (sortCriteria === 'date') {
      // Log original date strings
      console.log(`Original dates: ${a.createdAt}, ${b.createdAt}`);
  
      // Attempt to parse the dates using Date.parse for initial validation
      const timeA = a.createdAt ? Date.parse(a.createdAt) : 0; // Default to epoch if undefined/null
      const timeB = b.createdAt ? Date.parse(b.createdAt) : 0; // Default to epoch if undefined/null
  
      // If Date.parse returns NaN, the date is invalid
      if (isNaN(timeA) || isNaN(timeB)) {
        console.error('Invalid date encountered', {
          dateA: a.createdAt,
          dateB: b.createdAt
        });
        // Handle the error as appropriate for your application
        return 0;
      }
  
      // Convert to Date objects if parsing was successful
      const dateA = new Date(timeA);
      const dateB = new Date(timeB);
  
      // Debugging: log out the valid Date objects being compared
      console.log(`Valid dates: ${dateA.toISOString()}, ${dateB.toISOString()}`);
  
      // Compare dates
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  function ClassroomCard({ classroom }) {
    // This is a functional component to display each classroom card
    return (
      <div id='dashboard-class-card' className={classroom.isActive ? 'active' : 'inactive'}>
        <div id='card-left-content-container'>
          <h1 id='card-title'>{classroom.name}</h1>
          <div id='card-button-container' className='flex flex-row'>
            <button onClick={() => handleViewClassroom(classroom.id)}>
              View
            </button>
            {/* Button to toggle active/inactive state */}
            <button onClick={() => toggleClassroomActiveState(classroom.id)}>
      {classroom.isActive ? 'Mark as Inactive' : 'Mark as Active'}
    </button>
          </div>
        </div>
        <div id='card-right-content-container'>
          <DashboardDisplayCodeModal code={classroom.code} />
          <div id='divider' />
          <div id='student-number-container'>
            <h1 id='number'>{classroom.students.length}</h1>
            <p id='label'>Students</p>
          </div>
        </div>
      </div>
    );
  }

  // Function to render classrooms
  const renderClassrooms = (classrooms) => {
    return classrooms.map((classroom) => (
      <div key={classroom.id} id='dashboard-class-card' className={classroom.isActive ? 'active' : 'inactive'}>
        {/* ... (rest of the existing classroom card markup) */}
        <Button onClick={() => toggleClassroomActiveState(classroom)}>
          {classroom.isActive ? 'Mark as Inactive' : 'Mark as Active'}
        </Button>
      </div>
    ));
  };

  // This is the function where you would put the axios call
  const updateClassroom = async (classroomId, updateData) => {
    try {
      // The actual axios call to update classroom information
      const response = await axios.put(`/api/classrooms/${classroomId}`, updateData);
      // Handle the successful response here
      console.log('Classroom updated successfully:', response.data);
      // You might want to update your state or trigger other actions here
    } catch (error) {
      // Handle any errors here
      console.error('Failed to update classroom', error);
    }
  };
  

  return (
    <div className='container nav-padding'>
      <NavBar />
      <Tabs defaultActiveKey={activeTab} onChange={onTabChange}>
        <TabPane tab="Home" key="home">
          {/* Home tab content */}
        </TabPane>
        <TabPane tab="Dashboard" key="dashboard">
          <MentorSubHeader title={'Your Classrooms'} />
          <div style={{ marginBottom: '16px' }}>
            <Input
              placeholder="Filter Classrooms..."
              onChange={handleFilterChange}
              style={{ width: '300px', marginRight: '16px' }}
            />
            <Select defaultValue="name_asc" onChange={handleSortChange} style={{ width: 120 }}>
              <Option value="name_asc">Name: A-Z</Option>
              <Option value="name_desc">Name: Z-A</Option>
              <Option value="students_asc">Students ASC</Option>
              <Option value="students_desc">Students DESC</Option>
              <Option value="date_asc">Date ASC</Option>
              <Option value="date_desc">Date DESC</Option>
            </Select>
          </div>
          <Tabs defaultActiveKey="1" type="card" centered>
          <TabPane tab="Active" key="1">
          <div id='classrooms-container' style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {sortedClassrooms.filter(c => c.isActive).map((classroom) => (
              <ClassroomCard key={classroom.id} classroom={classroom} />
            ))}
          </div>
        </TabPane>
        <TabPane tab="Inactive" key="2">
          <div id='classrooms-container' style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {sortedClassrooms.filter(c => !c.isActive).map((classroom) => (
              <ClassroomCard key={classroom.id} classroom={classroom} />
            ))}
          </div>
        </TabPane>
          </Tabs>
        </TabPane>
      </Tabs>
    </div>
  );
  }    

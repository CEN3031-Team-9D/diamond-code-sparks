import React, { useEffect, useState } from 'react';
import { 
  getMentor,
  getClassrooms,
  getLessonModuleAll,
  deleteLessonModule,
  getGrades,
  getTeachers
} from '../../../Utils/requests';
import { message, Tabs, Table, Input, Select, Button, Popconfirm, Dropdown, Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './Dashboard.less';
import Share from './Share';
import DashboardDisplayCodeModal from './DashboardDisplayCodeModal';
import MentorSubHeader from '../../../components/MentorSubHeader/MentorSubHeader';
import NavBar from '../../../components/NavBar/NavBar';
import UnitCreator from '../../ContentCreator/UnitCreator/UnitCreator';
import LessonModuleActivityCreator from '../../ContentCreator/LessonModuleCreator/LessonModuleCreator';
import UnitEditor from '../../ContentCreator/UnitEditor/UnitEditor';
import LessonEditor from '../../ContentCreator/LessonEditor/LessonEditor';
import { useGlobalState } from '../../../Utils/userState';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const { TabPane } = Tabs;
const { Option } = Select;

export default function Dashboard() {
  const [classrooms, setClassrooms] = useState([]);
  const [value] = useGlobalState('currUser');
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [learningStandardList, setLessonModuleList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.has('tab') ? searchParams.get('tab') : 'home'
  );
  const [page, setPage] = useState(
    searchParams.has('page') ? parseInt(searchParams.get('page')) : 1
  );
  const [viewing, setViewing] = useState(parseInt(searchParams.get('activity')));
  const [sortCriteria, setSortCriteria] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [activeClassrooms, setActiveClassrooms] = useState([]);
  const [inactiveClassrooms, setInactiveClassrooms] = useState([]);
  const [teachers, setTeachers] = useState([]);

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
        getTeachers().then((teacherResponse) => {
          if (teacherResponse) {
            console.log(teacherResponse);
            const teachersFiltered = teacherResponse.data.map(({first_name, last_name, id}) => ({first_name, last_name, id}))
            setTeachers(teachersFiltered);
          } else {
            message.error('Failed to retrieve teachers');
          }
        })
      } else {
        message.error(res.err);
        navigate('/teacherlogin');
      }
    });
    const fetchData = async () => {
      const [lsResponse, gradeResponse] = await Promise.all([
        getLessonModuleAll(),
        getGrades(),
      ]);
      setLessonModuleList(lsResponse.data);
      const grades = gradeResponse.data;
      grades.sort((a, b) => (a.id > b.id ? 1 : -1));
      setGradeList(grades);
    };
    fetchData();
  }, [navigate]); // Added navigate to the dependency array as it is being used inside the effect

  const columns = [
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      editable: true,
      width: '22.5%',
      align: 'left',
      render: (_, key) => (
        <UnitEditor id={key.unit.id} unitName={key.unit.name} linkBtn={true} />
      ),
    },
    {
      title: 'Lesson',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      width: '22.5%',
      align: 'left',
      render: (_, key) => (
        <LessonEditor
          learningStandard={key}
          linkBtn={true}
          viewing={viewing}
          setViewing={setViewing}
          tab={activeTab}
          page={page}
        />
      ),
    },
    {
      title: 'Description',
      dataIndex: 'expectations',
      key: 'character',
      editable: true,
      width: '22.5%',
      align: 'left',
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      key: 'delete',
      width: '10%',
      align: 'right',
      render: (_, key) => (
        <Popconfirm
          title={'Are you sure you want to delete this learning standard?'}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={async () => {
            const res = await deleteLessonModule(key.id);
            if (res.err) {
              message.error(res.err);
            } else {
              setLessonModuleList(
                learningStandardList.filter((ls) => {
                  return ls.id !== key.id;
                })
              );
              message.success('Delete success');
            }
          }}
        >
          <button id={'link-btn'}>Delete</button>
        </Popconfirm>
      ),
    },
    {
      title: 'Share',
      dataIndex: 'share',
      key: 'share',
      width: '10%',
      align: 'right',
      render: (_, key) => (
        <Share
          lesson={key}
          teachers={teachers}
        />
      ),
    },
  ];
  
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

  const toggleClassroomActiveState = (classroom) => {
    // Toggle the isActive state for the classroom
    const updatedClassroom = { ...classroom, isActive: !classroom.isActive };
  
    // Update the classroom on the server
    updateClassroom(classroom.id, { isActive: updatedClassroom.isActive }).then(response => {
      if (response && response.data) {
        // Update the state with the new classroom status
        setClassrooms(prevClassrooms =>
          prevClassrooms.map(c =>
            c.id === classroom.id ? updatedClassroom : c
          )
        );
  
        // Update activeClassrooms and inactiveClassrooms states
        setActiveClassrooms(prevActive =>
          updatedClassroom.isActive
            ? [...prevActive, updatedClassroom]
            : prevActive.filter(c => c.id !== classroom.id)
        );
        setInactiveClassrooms(prevInactive =>
          !updatedClassroom.isActive
            ? [...prevInactive, updatedClassroom]
            : prevInactive.filter(c => c.id !== classroom.id)
        );
  
      } else {
        message.error('Could not update classroom state');
      }
    }).catch(error => {
      message.error('Error updating classroom: ' + error.message);
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
            <button onClick={() => toggleClassroomActiveState(classroom)}>
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
        <TabPane tab="Your Lessons" key="home">
	  <div id='page-header'>
            <h1>Lessons & Units</h1>
          </div>
          <div id='content-creator-table-container'>
            <div id='content-creator-btn-container'>
              <UnitCreator gradeList={gradeList} />
              <LessonModuleActivityCreator
                setLessonModuleList={setLessonModuleList}
                viewing={viewing}
                setViewing={setViewing}
                tab={activeTab}
                page={page}
              />
            </div>
            <Table
              columns={columns}
              dataSource={learningStandardList}
              rowClassName='editable-row'
              rowKey='id'
              onChange={(Pagination) => {
                setViewing(undefined);
                setPage(Pagination.current);
                setSearchParams({ activeTab, page: Pagination.current });
              }}
              pagination={{ current: page || 1 }}
            ></Table>
          </div>
        </TabPane>
        <TabPane tab="Your Classrooms" key="dashboard">
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
          <Tabs type="card">
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

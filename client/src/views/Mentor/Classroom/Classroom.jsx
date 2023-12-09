import { React, useEffect, useState } from 'react';
import { getMentor, getClassrooms } from '../../../Utils/requests';
import { Tabs, message } from 'antd';
import './Classroom.less';

import NavBar from '../../../components/NavBar/NavBar';
import Roster from './Roster/Roster';
import Home from './Home/Home';
import SavedWorkSpaceTab from '../../../components/Tabs/SavedWorkspaceTab';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

export default function Classroom({
  handleLogout,
  selectedActivity,
  setSelectedActivity,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [classrooms, setClassrooms] = useState([]);

  const { id } = useParams();
  const tab = searchParams.get('tab');
  const viewing = searchParams.get('viewing');
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem('classroomId', id);
    let classroomIds = [];
    getMentor().then((res) => {
      if (res.data) {
        res.data.classrooms.forEach((classroom) => {
          classroomIds.push(classroom.id);
        });
        getClassrooms(classroomIds).then((classrooms) => {
          setClassrooms(classrooms);
        });
      } else {
        message.error(res.err);
        navigate('/teacherlogin');
      }
    });
    sessionStorage.setItem('classrooms', classrooms);
  }, [id]);

  return (
    <div className='container nav-padding'>
      <NavBar isMentor={true} />
      <Tabs
        defaultActiveKey={tab ? tab : 'home'}
        onChange={(key) => setSearchParams({ tab: key })}
      >
        <TabPane tab='Home' key='home'>
          <Home
            classroomId={parseInt(id)}
            selectedActivity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
            viewing={viewing}
          />
        </TabPane>
        <TabPane tab='Roster' key='roster'>
          <Roster handleLogout={handleLogout} classroomId={id} classrooms={classrooms} />
        </TabPane>
        <TabPane tab='Saved Workspaces' key='workspace'>
          <SavedWorkSpaceTab
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            classroomId={id}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}

import ChatBox from '../../components/chatbox';
import GetAllUsers from '../../components/SideBar';
import './home.css';

function Home() {
  return (
    <div className='container-home'>
      <div className='in-con'>
      <div className='side'>
        <GetAllUsers />
      </div>
      <div className='chat'>
        <ChatBox />
      </div>
      </div>
    </div>
  );
}

export default Home;
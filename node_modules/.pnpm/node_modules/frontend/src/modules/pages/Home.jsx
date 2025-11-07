import ChatBox from '../../components/chatbox';
import GetAllUsers from '../../components/SideBar';

function Home() {
  return (
    <div>
      <div>
        <GetAllUsers />
      </div>
      <div>
        <ChatBox />
      </div>
    </div>
  );
}

export default Home;
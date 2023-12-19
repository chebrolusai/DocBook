import { useNavigate } from "react-router-dom";
const NotFoundComponent: React.FC = () => {
    const navigate = useNavigate();
    const handleButtonClick = () => {
        navigate('/');
    };
    return (
        <div className="Error-message">
            <h1>404 REQUEST NOT FOUND</h1>
            <p>Sorry, the page you are looking for does not exist</p>
            <button onClick={handleButtonClick}>Click this button to go back to the home page</button>
        </div>
    )
};

export default NotFoundComponent;
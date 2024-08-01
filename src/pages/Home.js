import NavBar from '../components/NavBar/NavBar';
import Hero from '../components/Hero/Hero';
import Connector from '../components/Connector/Connector';

export default function Home() {
    return (
        <>
            <NavBar />
            <div>
                <div className="App">    
                    {/*<img src={logo} className="App-logo" alt="logo" />*/}
                    <Hero />
                    <Connector /> 
                </div>
            </div>
        </>    
    );
};
import {lazy} from 'react'
import {Route, Routes} from "react-router-dom";
import './App.css'

const Layout = lazy(() => import('./pages/Layout.jsx'));
const RecoveryCampaign = lazy(() => import('./pages/RecoveryCampaign.jsx'));
const Students = lazy(() => import('./pages/Students.jsx'));
const PageNotFound = lazy(() => import('./pages/PageNotFound.jsx'));
const RecoveryAgent = lazy(() => import('./pages/RecoveryAgent.jsx'));
const FllowUp = lazy(() => import('./pages/FllowUp.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));

function App() {

    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path='' element={<RecoveryCampaign/>}/>
                <Route path='/recovery-agent' element={<RecoveryAgent/>}/>
                <Route path='/follow-up' element={<FllowUp/>}/>
                <Route path='/students' element={<Students/>}/>
                <Route path='*' element={<PageNotFound/>}/>
            </Route>
            <Route path="/login" element={<Login/>}/>
            <Route path='*' element={<PageNotFound/>}/>
        </Routes>
    )
}

export default App

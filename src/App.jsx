import {lazy} from 'react'
import {Route, Routes} from "react-router-dom";
import './App.css'

const Layout = lazy(() => import('./pages/Layout.jsx'));
const RecoveryCampaign = lazy(() => import('./pages/RecoveryCampaign.jsx'));
const CampaignDetails = lazy(() => import('./pages/CampaignDetails.jsx'));
const Students = lazy(() => import('./pages/Students.jsx'));
const PageNotFound = lazy(() => import('./pages/PageNotFound.jsx'));
const RecoveryAgent = lazy(() => import('./pages/RecoveryAgent.jsx'));
const FollowUp = lazy(() => import('./pages/FollowUp.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));

function App() {

    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path='' element={<RecoveryCampaign/>}/>
                <Route path='/campaign-details/:campaignId' element={<CampaignDetails/>}/>
                <Route path='/campaign-details/:campaignId/follow-up' element={<FollowUp/>}/>
                <Route path='/recovery-agent' element={<RecoveryAgent/>}/>
                <Route path='/students' element={<Students/>}/>
                <Route path='*' element={<PageNotFound/>}/>
            </Route>
            <Route path="/login" element={<Login/>}/>
            <Route path='*' element={<PageNotFound/>}/>
        </Routes>
    )
}

export default App

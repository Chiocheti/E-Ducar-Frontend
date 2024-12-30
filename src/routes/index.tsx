import { Routes as Switch, Route } from 'react-router-dom'

import Login from '../pages/Login'
import CreateUser from '../pages/CreateUser'
import Private from './Private'
import CreateCourse from '../pages/CreateCourse'
import UpdateUser from '../pages/UpdateUser'

export default function Routes() {

  return (
    <Switch>
      <Route path='/' element={<Login />} />

      <Route
        path='/CreateUser'
        element={
          <Private>
            <CreateUser />
          </Private>
        } />

      <Route
        path='/UpdateUser'
        element={
          <Private>
            <UpdateUser />
          </Private>
        } />

      <Route
        path='/CreateCourse'
        element={
          <Private>
            <CreateCourse />
          </Private>
        } />
    </Switch>
  )
}
import { VFC } from "react"
import { Switch, Route } from "react-router-dom"
import { Calendar } from "../components/pages/Calendar"
import { Page404 } from "../components/pages/Page404"
import { scheduleRouter } from "./ScheduleRouter"
import { TargetDateProvider } from "../providers/TargetDateProvider"
import { ShowDrawerProvider } from "../providers/ShowDrawerProvider"
import { AllSchedulesProvider } from "../providers/AllSchedulesProvider"
import { UserInfoProvider } from "../providers/UserInfoProvider"
import { Contact } from "../components/pages/Contact"
import { Thanks } from "../components/pages/Thanks"

export const Router: VFC = () => {
    return (
        <Switch>
            <TargetDateProvider>
            <AllSchedulesProvider>
            <ShowDrawerProvider>
            <UserInfoProvider>
            <Route exact path="/">
                <Calendar />
            </Route>
            <Route exact path="/contact">
                <Contact />
            </Route>
            <Route exact path="/thanks">
                <Thanks />
            </Route>            
            <Route  path="/schedule" render={({match: {url}}) => (
                <Switch>
                    {scheduleRouter.map((route) => (
                        <Route key={route.path} exact={route.exact} path={`${url}${route.path}`}>
                            {route.children}
                        </Route>
                    ))}
                </Switch>
            )} />          
            </UserInfoProvider>
            </ShowDrawerProvider>
            </AllSchedulesProvider>
            </TargetDateProvider>
            <Route path="*">
              <Page404 />
            </Route>              
        </Switch>
    )
}
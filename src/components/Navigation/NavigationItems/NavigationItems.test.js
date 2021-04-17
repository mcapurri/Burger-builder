import { configure, shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

import NavigationItems from "./NavigationItems";
import NavItem from "./NavItem/NavItem";

configure({ adapter: new Adapter() });

describe("<NavigationItems />", () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<NavigationItems />);
    });

    it("should render 2 <NavigationItems /> if not authenticated", () => {
        expect(wrapper.find(NavItem)).toHaveLength(2);
    });
    it("should render 3 <NavigationItems /> if authenticated", () => {
        // wrapper = shallow(<NavigationItems isAuthenticated />);
        wrapper.setProps({ isAuthenticated: true });
        expect(wrapper.find(NavItem)).toHaveLength(3);
    });
    it("should an exact logout button", () => {
        wrapper.setProps({ isAuthenticated: true });
        expect(
            wrapper.contains(<NavItem link="/logout">Logout</NavItem>)
        ).toEqual(true);
    });
});

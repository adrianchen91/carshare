// Import Actions
// import { TOGGLE_ADD_POST } from './AppActions'; // import actions here

// Initial State
const initialState = {
  // showAddPost: false,
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    // case TOGGLE_ADD_POST: // based on example action
    //   return {
    //     showAddPost: !state.showAddPost,
    //   };

    default:
      return state;
  }
};

/* Selectors */

// Get showAddPost
// export const getShowAddPost = state => state.app.showAddPost;

// Export Reducer
export default AppReducer;

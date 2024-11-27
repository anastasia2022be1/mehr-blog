// register a new user
// POST: api/users/register

const registerUser = (req, res, next) => {
    res.json('Register user')
}

//-----------------------------------------------------

// login user
// POST: api/users/login

const loginUser = (req, res, next) => {
    res.json('Login user')
}

//-----------------------------------

//user profile
// POST: api/users/:id
// protected

const getUser = (req, res, next) => {
    res.json('User profile')
}

//----------------------------------------------

// change user avatar
// POST: api/users/change-avatar
// protected

const changeAvatar = (req, res, next) => {
    res.json('Change user avatar')
}

//--------------------------------------------------

// edit user details
// POST: api/users/edit-user

const editUser = (req, res, next) => {
    res.json('Edit user details')
}

//-------------------------------------

// edit user details
// POST: api/users/authors
// unprotected


const getAuthors = (req, res, next) => {
    res.json('All authors')
}

export default { registerUser, loginUser, getUser, editUser, getAuthors, changeAvatar }
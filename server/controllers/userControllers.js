// register a new user
// POST: api/users/register

export const registerUser = async (req, res, next) => {
    res.json('Register user')
}

//-----------------------------------------------------

// login user
// POST: api/users/login

export const loginUser = async (req, res, next) => {
    res.json('Login user')
}

//-----------------------------------

//user profile
// POST: api/users/:id
// protected

export const getUser = async (req, res, next) => {
    res.json('User profile')
}

//----------------------------------------------

// change user avatar
// POST: api/users/change-avatar
// protected

export const changeAvatar = async (req, res, next) => {
    res.json('Change user avatar')
}

//--------------------------------------------------

// edit user details
// POST: api/users/edit-user

export const editUser = async (req, res, next) => {
    res.json('Edit user details')
}

//-------------------------------------

// edit user details
// POST: api/users/authors
// unprotected


export const getAuthors = async (req, res, next) => {
    res.json('All authors')
}
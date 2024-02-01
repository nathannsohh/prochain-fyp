import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
    name: 'ownProfile',
    initialState: {
        first_name: null,
        last_name: null,
        pronouns: null,
        email: null,
        wallet_address: null,
        bio: null,
        location: null,
        connections: null,
        content_hash: null,
        profile_picture_hash: null,
        profile_banner_hash: null,
        posts: null
    } as ProfileState,
    reducers: {
        updateSelf: (state, action: PayloadAction<UserStateType>) => {
            const user = action.payload
            state.first_name = user.first_name
            state.last_name = user.last_name
            state.pronouns = user.pronouns
            state.email = user.email
            state.wallet_address = user.wallet_address
            state.bio = user.bio
            state.location = user.location
            state.connections = user.connections
            state.content_hash = user.content_hash
            state.profile_banner_hash = user.profile_banner_hash
            state.profile_picture_hash = user.profile_picture_hash
        },
        removeSelf: (state) => {
            state.first_name = null
            state.last_name = null
            state.pronouns = null
            state.email = null
            state.wallet_address = null
            state.bio = null
            state.location = null
            state.connections = null
            state.content_hash = null
            state.posts = null
            state.profile_banner_hash = null
            state.profile_picture_hash = null
        },
        updatePosts: (state, action: PayloadAction<Array<PostType>>) => {
            state.posts = action.payload
        }
    }
})

export const { updateSelf, removeSelf, updatePosts } = profileSlice.actions

export default profileSlice.reducer
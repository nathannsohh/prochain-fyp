import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const orgProfileSlice = createSlice({
    name: 'orgProfile',
    initialState: {
        company_name: null,
        industry: null,
        email: null,
        wallet_address: null,
        bio: null,
        location: null,
        followers: null,
        content_hash: null,
        profile_picture_hash: null,
        profile_banner_hash: null,
        posts: null
    } as OrganisationProfileState,
    reducers: {
        updateSelf: (state, action: PayloadAction<OrganisationStateType>) => {
            const org = action.payload
            state.company_name = org.company_name
            state.industry = org.industry
            state.email = org.email
            state.wallet_address = org.wallet_address
            state.bio = org.bio
            state.location = org.location
            state.followers = org.followers
            state.content_hash = org.content_hash
            state.profile_banner_hash = org.profile_banner_hash
            state.profile_picture_hash = org.profile_picture_hash
        },
        removeSelf: (state) => {
            state.company_name = null
            state.industry = null
            state.email = null
            state.wallet_address = null
            state.bio = null
            state.location = null
            state.followers = null
            state.content_hash = null
            state.profile_banner_hash = null
            state.profile_picture_hash = null
        },
        updatePosts: (state, action: PayloadAction<Array<PostType>>) => {
            state.posts = action.payload
        }
    }
})

export const { updateSelf, removeSelf, updatePosts } = orgProfileSlice.actions

export default orgProfileSlice.reducer
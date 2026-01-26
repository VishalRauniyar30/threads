'use server'

import { FilterQuery, SortOrder } from "mongoose"

import { connectDB } from "../mongoose";
import Community from "../models/community.model"
import User from "../models/user.model"
import Thread from "../models/thread.model"

export async function createCommunity(
    id: string,
    name: string,
    username: string,
    image: string,
    bio: string,
    createdById: string // Change the parameter name to reflect it's an id
) {
    try {
        await connectDB()
        // Find the user with the provided unique id
        const user = await User.findOne({ id: createdById })

        if(!user) {
            throw new Error('User Not Found') // Handle the case if the user with the id is not found
        }
        console.log("createdById:", createdById)
        console.log("user:", user)

        const newCommunity = new Community({
            id, name, username, image, bio, 
            createdBy: user._id // Use the mongoose ID of the user
        })

        const createdCommunity = await newCommunity.save()
        // Update User model
        user.communities.push(createdCommunity._id)

        await user.save()

        return createdCommunity
    } catch (error) {
        console.error("Error creating community:", error)
        throw error
    }
}

export async function fetchCommunityDetails(id: string) {
    try {
        await connectDB()

        const communityDetails = await Community.findOne({ id }).populate([
            "createdBy", {
                path: 'members',
                model: User,
                select: 'name username image _id id'
            }
        ])

        return communityDetails

    } catch (error) {
        // Handle any errors
        console.error("Error fetching community details:", error)
        throw error
    }
}


export async function fetchCommunityPosts(id: string) {
    try {
        await connectDB()

        const communityPosts = await Community.findById(id).populate({
            path: 'threads',
            model: Thread,
            populate: [{
                path: 'author',
                model: User,
                select: 'name image id'
            }, {
                path: 'children',
                model: Thread,
                populate: {
                    path: 'author',
                    model: User, 
                    select: 'image _id'
                }
            }]
        })

        return communityPosts
    } catch (error) {
        // Handle any errors
        console.error("Error fetching community posts:", error)
        throw error
    }
}

export async function fetchCommunities({
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc",
} : {
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
}) {
    try {
        await connectDB()
        // Calculate the number of users to skip based on the page number and page size.
        const skipAmount = (pageNumber -  1) * pageSize
        // Create a case-insensitive regular expression for the provided search string.
        const regex = new RegExp(searchString, 'i')
        // Create an initial query object to filter users.
        const query : FilterQuery<typeof Community> = {}
        // If the search string is not empty, add the $or operator to match either username or name fields
        if(searchString.trim() !== ""){
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } },
            ]
        }
        // Define the sort options for the fetched users based on createdAt field and provided sort order.
        const sortOptions = { createdAt: sortBy }

        const communitiesQuery = Community.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize).populate('members')

        // Count the total number of users that match the search criteria (without pagination).
        const totalCommunitiesCount = await Community.countDocuments(query)

        const communities = await communitiesQuery.exec()
        // Check if there are more users beyond the current page.
        const isNext = totalCommunitiesCount > skipAmount + communities.length
        
        return { communities, isNext }
    } catch (error) {
        console.error("Error fetching users:", error)
        throw error
    }
}

export async function addMemberToCommunity(
    communityId: string,
    memberId: string
) {
    try {
        await connectDB()

        const community = await Community.findOne({ id: communityId })

        if(!community) {
            throw new Error("Community not found")
        }

        const user = await User.findOne({ id: memberId })

        if(!user) {
            throw new Error("User not found")
        }

        if(community.members.includes(user._id)) {
            throw new Error("User is already a member of the community")
        }

        community.members.push(user._id)

        await community.save()

        user.communities.push(community._id)

        await user.save()

        return community

    } catch (error) {
        // Handle any errors
        console.error("Error adding member to community:", error)
        throw error
    }
}


export async function removeUserFromCommunity(
    userId: string,
    communityId: string
) {
    try {
        await connectDB()

        const userIdObject = await User.findOne({ id: userId }, { _id: 1 })

        const communityIdObject = await Community.findOne(
            { id: communityId },
            { _id: 1 }
        )

        if(!userIdObject) {
            throw new Error("User not found")
        }

        if (!communityIdObject) {
            throw new Error("Community not found")
        }

        await Community.updateOne(
            { _id: communityIdObject._id },
            { $pull: { members: userIdObject._id } }
        )

        await User.updateOne(
            { _id: userIdObject._id },
            { $pull: { members: communityIdObject._id } }
        )

        return { success: true }
    } catch (error) {
        // Handle any errors
        console.error("Error removing user from community:", error)
        throw error
    }
}

export async function updateCommunityInfo(
    communityId: string,
    name: string,
    username: string,
    image: string
) {
    try {
        await connectDB()

        const updatedCommunity = await Community.findOneAndUpdate(
            { id: communityId },
            { name, username, image }
        )

        if (!updatedCommunity) {
            throw new Error("Community not found")
        }

        return updatedCommunity

    } catch (error) {
        // Handle any errors
        console.error("Error updating community information:", error)
        throw error
    }
}

export async function deleteCommunity(communityId: string) {
    try {
        await connectDB()

        const deletedCommunity = await Community.findOneAndDelete({
            id: communityId
        })

        if (!deletedCommunity) {
            throw new Error("Community not found")
        }

        await Thread.deleteMany({ community: communityId })

        const communityUsers = await User.find({ communities: communityId })

        const updateUserPromises = communityUsers.map((user) => {
            user.communities.pull(communityId)
            return user.save()
        })
        await Promise.all(updateUserPromises)

        return deletedCommunity

    } catch (error) {
        // Handle any errors
        console.error("Error deleting community:", error)
        throw error
    }
}
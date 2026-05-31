## User

- id(PK)
- username
- full name
- phone
- email
- bio
- password
- image_url
- createdAt
- updatedAt
- role

## Follower

- id(PK)
- personWhoFollowed(FK) 
- personWHoWasFollowed(FK) 

## Tag

- id (PK)
- userId(FK)
- postId(FK)
- content

## Post

- id(PK)
- userId(FK)
- media_url
- heading
- content
- slug
- published
- createdAt
- updatedAt
- viewCount


## PostLike

- id(PK)
- userId(FK)
- postId(FK)

## Comment

- id(PK)
- postId(FK)
- userId(FK)
- content
- parentId(FK)

## CommentLike

- id(PK)
- commentId(FK)
- userId(FK)

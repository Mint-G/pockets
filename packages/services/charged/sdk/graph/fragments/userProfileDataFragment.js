import gql from 'graphql-tag'

export const userProfileDataFragment = gql`
  fragment userProfileDataFragment on WBoson {
    id
    wBoson
    account
    wBosonUri
    name
    description
    thumbnail
    image
    email
    twitter
    website
  }
`
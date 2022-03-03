// Dependencies
import axios from "axios";
import getToken from "./getToken";

// Get contacts function
const getContacts = async () => {
    try {
        const token = await getToken();

        // Make axios request
        const response = await axios({
            method: "post",
            url: "https://learn.01founders.co/api/graphql-engine/v1/graphql",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            data: JSON.stringify({
                query: `{
                user(where :{
                  events: {
                    event: {
                      path: {
                        _eq:"/london/div-01"
                      }
                    }
                  }
                }){
                  login
                  attrs
                  events {
                    event{
                      path
                      createdAt
                    }
                  }
                  progresses{
                          path
                          createdAt
                          isDone
                        }
                        events_aggregate(where:{
                          xp:{
                            path:{
                              _eq:"/london/div-01"
                            }
                          }
                        }){
                          nodes{
                            xp{
                              amount
                              path
                             
                            }
                          }
                        }
                }
                
              }`,
                variables: {},
            }),
        });

        // Check data
        if (!response || !response.data || !response.data.data)
            throw new Error("Data object not found");
        if (!response.data.data.user || !Array.isArray(response.data.data.user))
            throw new Error("Users object not found");
        // Extract
        const users = response.data.data.user;

        //return users;
        // Re-prepare info
        const changedUsers = users.map((user: any) => {
            // Return result
            return {
                login: user.login,
                firstname: user.attrs.firstName,
                lastname: user.attrs.lastName,
                image: user.attrs.image,
                progresses: user.progresses,
                event:
                    user.events.filter(
                        (x: any) =>
                            x.event.path == "/london/div-01" &&
                            x.event.createdAt > "2022-01-10"
                    ).length == 1
                        ? "January"
                        : "October",
                xp:
                    user.events_aggregate.nodes[0] != undefined
                        ? user.events_aggregate.nodes[0].xp.amount
                        : undefined,
            };
        });
        return changedUsers;
    } catch (e) {
        throw e;
    }
};

export default getContacts;

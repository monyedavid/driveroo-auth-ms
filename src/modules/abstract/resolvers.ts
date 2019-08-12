import { ResolverMap } from "../../types/graphql-utile";

export const resolvers: ResolverMap = {
    me_response: {
        __resolveType: obj => {
            if (obj.path) {
                return "Error";
            }

            return "me_data";
        }
    },
    driver_Response: {
        __resolveType: obj => {
            if (obj.path) {
                return "Error";
            }

            return "Driver";
        }
    },
    User: {
        __resolveType: obj => {
            switch (obj.type) {
                default:
                    return "Driver";
            }
        }
    },
    admin_response: {
        __resolveType: obj => {
            switch (obj.path) {
                case "Error":
                    return "Error";
                default:
                    return "_admin";
            }
        }
    }
};

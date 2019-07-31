import { ResolverMap } from "../../types/graphql-utile";

export const resolvers: ResolverMap = {
    me_response: {
        __resolveType: obj => {
            if (obj.path) {
                return "Error";
            }

            return "me_data";
        }
    }
};

// SERVER ONLY — never import this in a Client Component.
// Never import this file in a Client Component.

export interface GithubRepo {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  primaryLanguage: { name: string; color: string } | null;
  topics: string[];
}

interface GithubGraphQLResponse {
  data?: {
    user?: {
      pinnedItems?: {
        nodes?: Array<{
          name: string;
          description: string | null;
          url: string;
          stargazerCount: number;
          primaryLanguage: { name: string; color: string } | null;
          repositoryTopics: {
            nodes: Array<{
              topic?: { name: string };
            }>;
          };
        } | null>;
      };
    };
  };
}

const QUERY = `
  query {
    user(login: "CodingRookieA") {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            primaryLanguage {
              name
              color
            }
            repositoryTopics(first: 6) {
              nodes {
                topic {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getPinnedRepos(): Promise<GithubRepo[]> {
  if (!process.env.GITHUB_TOKEN) {
    console.error("Missing GITHUB_TOKEN");
    return [];
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query: QUERY }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL request failed (${response.status})`);
    }

    const json = (await response.json()) as GithubGraphQLResponse;
    const nodes = json.data?.user?.pinnedItems?.nodes ?? [];

    return nodes
      .filter((repo): repo is NonNullable<typeof repo> => Boolean(repo))
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        url: repo.url,
        stargazerCount: repo.stargazerCount,
        primaryLanguage: repo.primaryLanguage,
        topics: repo.repositoryTopics.nodes
          .map((node) => node.topic?.name)
          .filter((topic): topic is string => Boolean(topic)),
      }));
  } catch (error) {
    console.error("Failed to fetch pinned repositories:", error);
    return [];
  }
}

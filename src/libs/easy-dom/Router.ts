import { Dynamic } from "./DynamicValue";
import { div } from "./elements";
import { EasyDomNode } from "./EasyDomNode";
import { NavigationMethod } from "./NavigationMethod";
export const RouterArg = "Router.Arg";
export type RouteSegment = string | typeof RouterArg;
interface Route {
  pattern?: RouteSegment | RouteSegment[];
  component: (...args: string[]) => EasyDomNode;
}

export type RouteConfig = Route[];

export function Router(routes: RouteConfig, source?: NavigationMethod) {
  function getSegments(path: string) {
    return path.replace(/^\//, "").replace(/\/$/, "").split("/");
  }

  function resolvePath(pathSegments: string[]) {
    const route = routes.find((route) => routeMatches(pathSegments, route));
    if (route) {
      resolveRoute(pathSegments, route);
    } else {
      throw new Error("No matching route");
    }
  }

  function routeMatches(pathSegments: string[], route: Route) {
    const matcher = route.pattern || [];
    const routeSegments: RouteSegment[] = Array.isArray(matcher)
      ? matcher
      : [matcher];
    for (let i = 0; i < routeSegments.length; i++) {
      const routeSegment = routeSegments[i];
      if (routeSegment !== RouterArg && routeSegment !== pathSegments[i]) {
        return false;
      }
    }
    return true;
  }

  function resolveRoute(pathSegments: string[], route: Route) {
    const { pattern, component } = route;
    const routeSegments: RouteSegment[] = Array.isArray(pattern)
      ? pattern
      : pattern
      ? [pattern]
      : [];
    const args = routeSegments
      .map((s, i) => (s === RouterArg ? i : false))
      .filter((v) => v !== false)
      .map((i) => pathSegments[i]);

    const newElement = component(...args);
    dynamicElement.set(newElement);
  }
  const dynamicElement = Dynamic<EasyDomNode>(div());
  if (source) {
    source.onChange((path) => resolvePath(getSegments(path)));
    resolvePath(getSegments(source.get()));
  } else {
    throw new Error("Not yet implemented");
  }
  return {
    dynamicElement,
  };
}

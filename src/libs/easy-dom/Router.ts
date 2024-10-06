import { DynamicValue } from "./DynamicValue";
import { div } from "./elements";
import { EasyDomNode } from "./EasyDomNode";
import { NavigationMethod } from "./NavigationMethod";

export type RouteSegment = string | typeof Router.Arg;
interface Route {
  pattern?: RouteSegment | RouteSegment[];
  component: (...args: string[]) => EasyDomNode;
}

export type RouteConfig = Route[];

export class Router {
  static readonly Arg = "Router.Arg";

  public dynamicElement = new DynamicValue<EasyDomNode>(div());

  constructor(private routes: RouteConfig, source?: NavigationMethod) {
    if (source) {
      source.onChange((path) => this.resolvePath(this.getSegments(path)));
      this.resolvePath(this.getSegments(source.get()));
    } else {
      throw new Error("Not yet implemented");
    }
  }

  private getSegments(path: string) {
    return path.replace(/^\//, "").replace(/\/$/, "").split("/");
  }

  private routeMatches(pathSegments: string[], route: Route) {
    const matcher = route.pattern || [];
    const routeSegments: RouteSegment[] = Array.isArray(matcher)
      ? matcher
      : [matcher];
    for (let i = 0; i < routeSegments.length; i++) {
      const routeSegment = routeSegments[i];
      if (routeSegment !== Router.Arg && routeSegment !== pathSegments[i]) {
        return false;
      }
    }
    return true;
  }

  resolvePath(pathSegments: string[]) {
    const route = this.routes.find((route) =>
      this.routeMatches(pathSegments, route)
    );
    if (route) {
      this.resolveRoute(pathSegments, route);
    } else {
      throw new Error("No matching route");
    }
  }

  resolveRoute(pathSegments: string[], route: Route) {
    const { pattern, component } = route;
    const routeSegments: RouteSegment[] = Array.isArray(pattern)
      ? pattern
      : pattern
      ? [pattern]
      : [];
    const args = routeSegments
      .map((s, i) => (s === Router.Arg ? i : false))
      .filter((v) => v !== false)
      .map((i) => pathSegments[i]);

    const newElement = component(...args);
    this.dynamicElement.set(newElement);
  }
}

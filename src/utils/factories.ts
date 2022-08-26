import { ChainId, Pair, Route } from '@goosebumps/sdk'
import {
  BASE_FACTORY_ADDRESS,
} from 'config/constants'

// Get's the name for a factory
export function getFactoryName(
  chainId: ChainId,
  factory: string
): string {
  if (factory === BASE_FACTORY_ADDRESS[chainId]) return "Goosebumps"
  return "Other";
}
export function getFactoryNameByPair(
  pair: Pair
): string {
  return getFactoryName(pair.chainId, pair.factory);
}

export function getFactoriesFromRoute(
  route: Route
): string[] {
  if (!route.pairs) return [];
  return Object.keys(route.pairs.reduce((uniquePairs: { [key: string]: number }, pair) => {
    uniquePairs[pair.factory] = uniquePairs[pair.factory] ? uniquePairs[pair.factory]++ : 1;
    return uniquePairs;
  }, {}));
}
export function usingDifferentFactories(
  route: Route
): boolean {
  return getFactoriesFromRoute(route).length > 1;
}

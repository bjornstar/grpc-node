/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

// Allow `any` data type for testing runtime type checking.
// tslint:disable no-any
import * as assert from 'assert';
import * as resolverManager from '../src/resolver';
import { ServiceConfig } from '../src/service-config';
import { StatusObject } from '../src/call-stream';

describe('Name Resolver', () => {
  describe('DNS Names', () => {
    before(() => {
      resolverManager.registerAll();
    });
    it('Should resolve localhost properly', done => {
      const target = 'localhost:50051';
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: string[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          assert(addressList.includes('127.0.0.1:50051'));
          // We would check for the IPv6 address but it needs to be omitted on some Node versions
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener);
      resolver.updateResolution();
    });
    it('Should default to port 443', done => {
      const target = 'localhost';
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: string[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          assert(addressList.includes('127.0.0.1:443'));
          // We would check for the IPv6 address but it needs to be omitted on some Node versions
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener);
      resolver.updateResolution();
    });
    it('Should resolve a public address', done => {
      const target = 'example.com';
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: string[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          assert(addressList.length > 0);
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener);
      resolver.updateResolution();
    });
    it('Should resolve a name with multiple dots', done => {
      const target = 'loopback4.unittest.grpc.io';
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: string[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          assert(addressList.length > 0);
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener);
      resolver.updateResolution();
    });
    it('Should resolve a name with a hyphen', done => {
      /* TODO(murgatroid99): Find or create a better domain name to test this with.
       * This is just the first one I found with a hyphen. */
      const target = 'network-tools.com';
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: string[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          assert(addressList.length > 0);
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener);
      resolver.updateResolution();
    });
  });
});

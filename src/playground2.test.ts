export {};
import { expectDeepEqual } from "ystd";

// Define the UnfinishedFoo interface
interface UnfinishedFoo {
    method1: (a: number) => string;
    method2: (a: number, b: string) => string;
}

// Utility function to extend a class with additional methods
function extendClass<BaseClassT extends UnfinishedFoo>(baseClass: BaseClassT) {
    return class extends baseClass {
        extMethod3(a: number, c: number): string {
            return `method3_res=${this.method1(a)} c=${c}`;
        }

        extMethod4(a: number, b: string, b2: string): string {
            return `method4_res=${this.method2(a, b)} b2=${b2}`;
        }
    };
}

// Example usage
class UnfinishedFooImpl implements UnfinishedFoo {
    method1(a: number): string {
        return `method1_res=${a * 2}`;
    }

    method2(a: number, b: string): string {
        return `method2_res=${a}+${b}`;
    }
}

class FooImplEtalon extends UnfinishedFooImpl {
    extMethod3(a: number, c: number): string {
        return `method3_res=${this.method1(a)} c=${c}`;
    }

    extMethod4(a: number, b: string, b2: string): string {
        return `method4_res=${this.method2(a, b)} b2=${b2}`;
    }
}

describe("my_ts_playground/playground2.test.ts", () => {
    it(`test base class`, () => {
        const instance = new UnfinishedFooImpl();

        const r = {
            m1: instance.method1(1),
            m2: instance.method2(1, "foo"),
        };

        expectDeepEqual<any>(r, {
            m1: "method1_res=2",
            m2: "method2_res=1+foo",
        });
    });

    it(`test extended - etalon`, () => {
        const instance = new FooImplEtalon();
        const r = {
            m3: instance.extMethod3(1, 2),
            m4: instance.extMethod4(1, "foo", "bar"),
        };

        expectDeepEqual<any>(r, {
            m3: "method3_res=method1_res=2 c=2",
            m4: "method4_res=method2_res=1+foo b2=bar",
        });
    });

    it(`test extended - base methods`, () => {
        const FooImpl = extendClass(UnfinishedFooImpl);

        const instance = new FooImpl();
        const r = {
            m1: instance.method1(1),
            m2: instance.method2(1, "foo"),
        };

        expectDeepEqual<any>(r, {
            m1: "method1_res=2",
            m2: "method2_res=1+foo",
        });
    });

    it(`test extended - extended methods`, () => {
        const FooImpl = extendClass(UnfinishedFooImpl);

        const instance = new FooImpl();

        const r = {
            m3: instance.extMethod3(1, 2),
            m4: instance.extMethod4(1, "foo", "bar"),
        };

        expectDeepEqual<any>(r, {
            m3: "method3_res=method1_res=2 c=2",
            m4: "method4_res=method2_res=1+foo b2=bar",
        });
    });
});

#!/usr/bin/env python3
"""
Comprehensive test suite for polynomial expression system.
Tests operator precedence, mathematical rules, and edge cases.
"""

from polynomial import X, Int, Add, Sub, Mul, Div

def test_basic_operations():
    """Test basic arithmetic operations"""
    print("=== Testing Basic Operations ===")
    
    # Test addition
    add_test = Add(Int(5), Int(3))
    result = add_test.evaluate(0)
    expected = Int(8)
    assert result.i == expected.i, f"Addition failed: {result} != {expected}"
    print(f"✓ Addition: {add_test} = {result}")
    
    # Test subtraction
    sub_test = Sub(Int(10), Int(4))
    result = sub_test.evaluate(0)
    expected = Int(6)
    assert result.i == expected.i, f"Subtraction failed: {result} != {expected}"
    print(f"✓ Subtraction: {sub_test} = {result}")
    
    # Test multiplication
    mul_test = Mul(Int(6), Int(7))
    result = mul_test.evaluate(0)
    expected = Int(42)
    assert result.i == expected.i, f"Multiplication failed: {result} != {expected}"
    print(f"✓ Multiplication: {mul_test} = {result}")
    
    # Test division
    div_test = Div(Int(20), Int(4))
    result = div_test.evaluate(0)
    expected = Int(5)
    assert result.i == expected.i, f"Division failed: {result} != {expected}"
    print(f"✓ Division: {div_test} = {result}")
    
    # Test variable evaluation
    x_test = X()
    result = x_test.evaluate(7)
    expected = Int(7)
    assert result.i == expected.i, f"Variable evaluation failed: {result} != {expected}"
    print(f"✓ Variable: {x_test} evaluated at X=7 = {result}")

def test_operator_precedence():
    """Test that multiplication and division have higher precedence than addition and subtraction"""
    print("\n=== Testing Operator Precedence ===")
    
    # Test: 2 + 3 * 4 should equal 14, not 20
    # Structure: Add(Int(2), Mul(Int(3), Int(4)))
    precedence_test1 = Add(Int(2), Mul(Int(3), Int(4)))
    result = precedence_test1.evaluate(0)
    expected = Int(14)  # 2 + (3 * 4) = 2 + 12 = 14
    assert result.i == expected.i, f"Precedence test 1 failed: {result} != {expected}"
    print(f"✓ 2 + 3 * 4 = {result} (multiplication before addition)")
    
    # Test: 10 - 2 * 3 should equal 4, not 24
    # Structure: Sub(Int(10), Mul(Int(2), Int(3)))
    precedence_test2 = Sub(Int(10), Mul(Int(2), Int(3)))
    result = precedence_test2.evaluate(0)
    expected = Int(4)  # 10 - (2 * 3) = 10 - 6 = 4
    assert result.i == expected.i, f"Precedence test 2 failed: {result} != {expected}"
    print(f"✓ 10 - 2 * 3 = {result} (multiplication before subtraction)")
    
    # Test: 2 * 3 + 4 * 5 should equal 26
    # Structure: Add(Mul(Int(2), Int(3)), Mul(Int(4), Int(5)))
    precedence_test3 = Add(Mul(Int(2), Int(3)), Mul(Int(4), Int(5)))
    result = precedence_test3.evaluate(0)
    expected = Int(26)  # (2 * 3) + (4 * 5) = 6 + 20 = 26
    assert result.i == expected.i, f"Precedence test 3 failed: {result} != {expected}"
    print(f"✓ 2 * 3 + 4 * 5 = {result} (both multiplications first)")
    
    # Test: 20 / 4 + 6 / 2 should equal 8
    # Structure: Add(Div(Int(20), Int(4)), Div(Int(6), Int(2)))
    precedence_test4 = Add(Div(Int(20), Int(4)), Div(Int(6), Int(2)))
    result = precedence_test4.evaluate(0)
    expected = Int(8)  # (20 / 4) + (6 / 2) = 5 + 3 = 8
    assert result.i == expected.i, f"Precedence test 4 failed: {result} != {expected}"
    print(f"✓ 20 / 4 + 6 / 2 = {result} (both divisions first)")

def test_complex_expressions():
    """Test complex nested expressions with multiple operations"""
    print("\n=== Testing Complex Expressions ===")
    
    # Test: (2 + 3) * (4 + 1) should equal 25
    # Structure: Mul(Add(Int(2), Int(3)), Add(Int(4), Int(1)))
    complex_test1 = Mul(Add(Int(2), Int(3)), Add(Int(4), Int(1)))
    result = complex_test1.evaluate(0)
    expected = Int(25)  # (2 + 3) * (4 + 1) = 5 * 5 = 25
    assert result.i == expected.i, f"Complex test 1 failed: {result} != {expected}"
    print(f"✓ (2 + 3) * (4 + 1) = {result}")
    
    # Test: (10 - 2) / (3 + 1) should equal 2
    # Structure: Div(Sub(Int(10), Int(2)), Add(Int(3), Int(1)))
    complex_test2 = Div(Sub(Int(10), Int(2)), Add(Int(3), Int(1)))
    result = complex_test2.evaluate(0)
    expected = Int(2)  # (10 - 2) / (3 + 1) = 8 / 4 = 2
    assert result.i == expected.i, f"Complex test 2 failed: {result} != {expected}"
    print(f"✓ (10 - 2) / (3 + 1) = {result}")
    
    # Test: 2 * X + 3 * X should equal 5 * X (when X = 2, should be 10)
    # Structure: Add(Mul(Int(2), X()), Mul(Int(3), X()))
    complex_test3 = Add(Mul(Int(2), X()), Mul(Int(3), X()))
    result = complex_test3.evaluate(2)
    expected = Int(10)  # 2 * 2 + 3 * 2 = 4 + 6 = 10
    assert result.i == expected.i, f"Complex test 3 failed: {result} != {expected}"
    print(f"✓ 2 * X + 3 * X (X=2) = {result}")
    
    # Test: X * X + 2 * X + 1 (quadratic: X² + 2X + 1)
    # When X = 3: 3² + 2*3 + 1 = 9 + 6 + 1 = 16
    # Structure: Add(Add(Mul(X(), X()), Mul(Int(2), X())), Int(1))
    quadratic = Add(Add(Mul(X(), X()), Mul(Int(2), X())), Int(1))
    result = quadratic.evaluate(3)
    expected = Int(16)  # 3² + 2*3 + 1 = 9 + 6 + 1 = 16
    assert result.i == expected.i, f"Quadratic test failed: {result} != {expected}"
    print(f"✓ X² + 2X + 1 (X=3) = {result}")

def test_mixed_precedence():
    """Test expressions with mixed operations and proper precedence"""
    print("\n=== Testing Mixed Precedence ===")
    
    # Test: 1 + 2 * 3 - 4 / 2 should equal 5
    # Structure: Sub(Add(Int(1), Mul(Int(2), Int(3))), Div(Int(4), Int(2)))
    mixed_test1 = Sub(Add(Int(1), Mul(Int(2), Int(3))), Div(Int(4), Int(2)))
    result = mixed_test1.evaluate(0)
    expected = Int(5)  # 1 + (2*3) - (4/2) = 1 + 6 - 2 = 5
    assert result.i == expected.i, f"Mixed test 1 failed: {result} != {expected}"
    print(f"✓ 1 + 2 * 3 - 4 / 2 = {result}")
    
    # Test: 2 * X + 3 - X / 2 (when X = 4)
    # Structure: Sub(Add(Mul(Int(2), X()), Int(3)), Div(X(), Int(2)))
    mixed_test2 = Sub(Add(Mul(Int(2), X()), Int(3)), Div(X(), Int(2)))
    result = mixed_test2.evaluate(4)
    expected = Int(9)  # 2*4 + 3 - 4/2 = 8 + 3 - 2 = 9
    assert result.i == expected.i, f"Mixed test 2 failed: {result} != {expected}"
    print(f"✓ 2 * X + 3 - X / 2 (X=4) = {result}")
    
    # Test: (X + 1) * (X - 1) (difference of squares: X² - 1)
    # When X = 5: (5+1) * (5-1) = 6 * 4 = 24
    # Structure: Mul(Add(X(), Int(1)), Sub(X(), Int(1)))
    diff_squares = Mul(Add(X(), Int(1)), Sub(X(), Int(1)))
    result = diff_squares.evaluate(5)
    expected = Int(24)  # (5+1) * (5-1) = 6 * 4 = 24
    assert result.i == expected.i, f"Difference of squares failed: {result} != {expected}"
    print(f"✓ (X + 1) * (X - 1) (X=5) = {result}")

def test_edge_cases():
    """Test edge cases and boundary conditions"""
    print("\n=== Testing Edge Cases ===")
    
    # Test division by 1
    div_by_one = Div(Int(7), Int(1))
    result = div_by_one.evaluate(0)
    expected = Int(7)
    assert result.i == expected.i, f"Division by 1 failed: {result} != {expected}"
    print(f"✓ 7 / 1 = {result}")
    
    # Test multiplication by 0
    mul_by_zero = Mul(Int(5), Int(0))
    result = mul_by_zero.evaluate(0)
    expected = Int(0)
    assert result.i == expected.i, f"Multiplication by 0 failed: {result} != {expected}"
    print(f"✓ 5 * 0 = {result}")
    
    # Test addition with 0
    add_zero = Add(Int(3), Int(0))
    result = add_zero.evaluate(0)
    expected = Int(3)
    assert result.i == expected.i, f"Addition with 0 failed: {result} != {expected}"
    print(f"✓ 3 + 0 = {result}")
    
    # Test subtraction resulting in 0
    sub_zero = Sub(Int(5), Int(5))
    result = sub_zero.evaluate(0)
    expected = Int(0)
    assert result.i == expected.i, f"Subtraction to 0 failed: {result} != {expected}"
    print(f"✓ 5 - 5 = {result}")
    
    # Test negative results
    negative_result = Sub(Int(2), Int(5))
    result = negative_result.evaluate(0)
    expected = Int(-3)
    assert result.i == expected.i, f"Negative result failed: {result} != {expected}"
    print(f"✓ 2 - 5 = {result}")
    
    # Test X = 0
    x_zero = Add(Mul(Int(3), X()), Int(7))
    result = x_zero.evaluate(0)
    expected = Int(7)  # 3*0 + 7 = 0 + 7 = 7
    assert result.i == expected.i, f"X=0 test failed: {result} != {expected}"
    print(f"✓ 3 * X + 7 (X=0) = {result}")

def test_nested_operations():
    """Test deeply nested operations"""
    print("\n=== Testing Nested Operations ===")
    
    # Test: ((2 + 3) * 4) - (6 / 2) should equal 17
    # Structure: Sub(Mul(Add(Int(2), Int(3)), Int(4)), Div(Int(6), Int(2)))
    nested_test1 = Sub(Mul(Add(Int(2), Int(3)), Int(4)), Div(Int(6), Int(2)))
    result = nested_test1.evaluate(0)
    expected = Int(17)  # ((2+3)*4) - (6/2) = (5*4) - 3 = 20 - 3 = 17
    assert result.i == expected.i, f"Nested test 1 failed: {result} != {expected}"
    print(f"✓ ((2 + 3) * 4) - (6 / 2) = {result}")
    
    # Test: (X + 2) * (X - 1) + (X * 3) (when X = 3)
    # Structure: Add(Mul(Add(X(), Int(2)), Sub(X(), Int(1))), Mul(X(), Int(3)))
    nested_test2 = Add(Mul(Add(X(), Int(2)), Sub(X(), Int(1))), Mul(X(), Int(3)))
    result = nested_test2.evaluate(3)
    expected = Int(19)  # (3+2)*(3-1) + (3*3) = 5*2 + 9 = 10 + 9 = 19
    assert result.i == expected.i, f"Nested test 2 failed: {result} != {expected}"
    print(f"✓ (X + 2) * (X - 1) + (X * 3) (X=3) = {result}")

def test_representation_accuracy():
    """Test that string representations correctly show precedence"""
    print("\n=== Testing Representation Accuracy ===")
    
    # Test that multiplication is properly parenthesized when needed
    mul_with_add = Mul(Add(Int(2), Int(3)), Int(4))
    representation = repr(mul_with_add)
    expected_pattern = "( 2 + 3 ) * 4"
    assert representation == expected_pattern, f"Representation failed: '{representation}' != '{expected_pattern}'"
    print(f"✓ Multiplication precedence: {representation}")
    
    # Test that division is properly parenthesized when needed
    div_with_sub = Div(Sub(Int(10), Int(2)), Int(4))
    representation = repr(div_with_sub)
    expected_pattern = "( 10 - 2 ) / 4"
    assert representation == expected_pattern, f"Representation failed: '{representation}' != '{expected_pattern}'"
    print(f"✓ Division precedence: {representation}")
    
    # Test complex representation
    complex_repr = Add(Mul(Int(2), X()), Div(Int(6), Int(2)))
    representation = repr(complex_repr)
    expected_pattern = "2 * X + 6 / 2"
    assert representation == expected_pattern, f"Complex representation failed: '{representation}' != '{expected_pattern}'"
    print(f"✓ Complex representation: {representation}")

def run_all_tests():
    """Run all test suites"""
    print("🧪 Starting Comprehensive Polynomial Test Suite")
    print("=" * 60)
    print("📝 NOTE: This is a student exercise. Some tests will fail until you implement the missing methods.")
    print("=" * 60)
    
    passed_tests = 0
    total_tests = 0
    
    try:
        # Test basic operations (should work with existing Add and Mul)
        print("\n🔍 Testing basic operations...")
        try:
            test_basic_operations()
            print("✅ Basic operations: PASSED")
            passed_tests += 1
        except Exception as e:
            print(f"❌ Basic operations: FAILED - {e}")
        total_tests += 1
        
        # Test operator precedence (should work with existing Add and Mul)
        print("\n🔍 Testing operator precedence...")
        try:
            test_operator_precedence()
            print("✅ Operator precedence: PASSED")
            passed_tests += 1
        except Exception as e:
            print(f"❌ Operator precedence: FAILED - {e}")
        total_tests += 1
        
        # Test complex expressions (should work with existing Add and Mul)
        print("\n🔍 Testing complex expressions...")
        try:
            test_complex_expressions()
            print("✅ Complex expressions: PASSED")
            passed_tests += 1
        except Exception as e:
            print(f"❌ Complex expressions: FAILED - {e}")
        total_tests += 1
        
        # Test mixed precedence (needs Sub and Div implementations)
        print("\n🔍 Testing mixed precedence...")
        try:
            test_mixed_precedence()
            print("✅ Mixed precedence: PASSED")
            passed_tests += 1
        except Exception as e:
            print(f"❌ Mixed precedence: FAILED - {e}")
            print("   💡 This test requires Sub and Div class implementations")
        total_tests += 1
        
        # Test edge cases (needs evaluate methods)
        print("\n🔍 Testing edge cases...")
        try:
            test_edge_cases()
            print("✅ Edge cases: PASSED")
            passed_tests += 1
        except Exception as e:
            print(f"❌ Edge cases: FAILED - {e}")
            print("   💡 This test requires evaluate method implementations")
        total_tests += 1
        
        # Test nested operations (needs evaluate methods)
        print("\n🔍 Testing nested operations...")
        try:
            test_nested_operations()
            print("✅ Nested operations: PASSED")
            passed_tests += 1
        except Exception as e:
            print(f"❌ Nested operations: FAILED - {e}")
            print("   💡 This test requires evaluate method implementations")
        total_tests += 1
        
        # Test representation accuracy (needs Sub and Div implementations)
        print("\n🔍 Testing representation accuracy...")
        try:
            test_representation_accuracy()
            print("✅ Representation accuracy: PASSED")
            passed_tests += 1
        except Exception as e:
            print(f"❌ Representation accuracy: FAILED - {e}")
            print("   💡 This test requires Sub and Div class implementations")
        total_tests += 1
        
        print("\n" + "=" * 60)
        print(f"📊 TEST RESULTS: {passed_tests}/{total_tests} test suites passed")
        
        if passed_tests == total_tests:
            print("🎉 ALL TESTS PASSED! Great job implementing the polynomial system!")
        else:
            print("📚 Keep working on the exercises to make all tests pass!")
            print("\n💡 EXERCISE PROGRESS:")
            if passed_tests >= 3:
                print("   ✅ Exercise 1 (Sub and Div classes): COMPLETED")
            else:
                print("   ⏳ Exercise 1 (Sub and Div classes): IN PROGRESS")
                
            if passed_tests >= 5:
                print("   ✅ Exercise 2 (evaluate methods): COMPLETED")
            else:
                print("   ⏳ Exercise 2 (evaluate methods): IN PROGRESS")
                
            print("   ⏳ Exercise 3 (simplify methods): OPTIONAL - Not tested yet")
        
    except Exception as e:
        print(f"\n💥 UNEXPECTED ERROR: {e}")
        return False
    
    return passed_tests == total_tests

if __name__ == "__main__":
    run_all_tests()

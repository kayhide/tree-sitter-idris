import XCTest
import SwiftTreeSitter
import TreeSitterIdris

final class TreeSitterIdrisTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_idris())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Idris grammar")
    }
}

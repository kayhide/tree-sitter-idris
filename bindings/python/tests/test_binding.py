from unittest import TestCase

from tree_sitter import Language, Parser
import tree_sitter_idris


class TestLanguage(TestCase):
    def test_keyword_fragments_in_error_recovery(self):
        parser = Parser(Language(tree_sitter_idris.language()))
        for declaration in ("module", "import", "data", "record"):
            for name in ("mainLoop", "shutdown", "mainLoop2", "shutdown_",
                         "mainLoop'", "shutdownλ"):
                with self.subTest(declaration=declaration, name=name):
                    source = f"{declaration} {name}\n".encode()
                    tree = parser.parse(source)
                    pending = [tree.root_node]
                    while pending:
                        node = pending.pop()
                        if node.type in ("in", "do"):
                            self.fail(f"Keyword fragment {node.text!r} in {source!r}")
                        pending.extend(node.children)

    def test_standalone_keywords_and_function_names(self):
        parser = Parser(Language(tree_sitter_idris.language()))
        source = b"mainLoop = do\n  let x = let y = 1 in y\n  shutdown\n"
        tree = parser.parse(source)
        self.assertFalse(tree.root_node.has_error)
        pending = [tree.root_node]
        keywords = []
        names = []
        while pending:
            node = pending.pop()
            if not node.is_named and node.type in ("in", "do"):
                keywords.append(node.text)
            if node.type == "loname":
                names.append(node.text)
            pending.extend(reversed(node.children))
        self.assertEqual(keywords, [b"do", b"in"])
        self.assertIn(b"mainLoop", names)
        self.assertIn(b"shutdown", names)

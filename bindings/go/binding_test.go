package tree_sitter_idris_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_idris "github.com/tree-sitter/tree-sitter-idris/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_idris.Language())
	if language == nil {
		t.Errorf("Error loading Idris grammar")
	}
}

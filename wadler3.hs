-- import GHC.List
-- import Data.Char

-- k :: (Num a) => a -> [Char]
-- k a = show a + "a"

-- h :: (Num c) => b -> c
-- h b
  -- | not isNumber b = drop 1 h
  -- | isNumber b = c
  -- where
--     c = read b


type M						= (M, unitM, bindM)
unitM :: a -> M a
unitM
bindM :: M a -> (a -> M b) -> M b
bindM

term0 = (App (Lam "x" (Add (Var "x") (Var "x")))
						 (Add (Con 10) (Con 11)))

type Name         = String

data Term         = Var Name
                  | Con Int
                  | Add Term Term
                  | Lam Name Term
                  | App Term Term

data Value        = Wrong
                  | Num Int
                  | Fun (Value -> M Value)

type Environment  = [(Name, Value)]

showval :: Value -> String
showval Wrong = "<wrong>"
showval (Num i) = show i
showval (Fun f) = "<function>"

interp :: Term -> Environment -> M Value
interp (Var x) e	= lookup x e
interp (Con i) e	= unitM (Num i)
interp (Add u v)	= interp u e `bindM` (\a ->
										interp v e `bindM` (\b ->
										add a b))
interp (Lam x v) e= unitM (Fun (\a -> interp v ((x,a):e)))
interp (App t u) e= interp t e `bindM` (\f ->
										interp u e `bindM` (\a ->
										apply f a))
